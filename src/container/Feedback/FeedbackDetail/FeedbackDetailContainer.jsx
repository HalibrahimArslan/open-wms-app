import { Box, Button, Chip, CircularProgress, Divider, Grid, IconButton, Typography, useTheme } from '@mui/material'
import useSWR from 'swr'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import ImageViewer from '../../../shared/components/ImageViewer/ImageViewer'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { useMemo, useRef, useState } from 'react'
import useIsMobile from '../../../hooks/useIsMobile'
import { useParams } from 'react-router'
import useAuthHeader from '../../../hooks/useAuthHeader'
import usePayload from '../../../hooks/usePayload'
import { deleteFeedbackComment, getFeedbacksById, saveFeedbackComment, updateFeedbackComment } from '../../../services/FeedbackService'
import { FeedbackStatus, FeedbackTitle, generatePayload } from '../../../utils/Utils'
import { notify, notifyError } from '../../../layout/Layout'
import FeedbackComment from '../../../components/Feedback/FeedbackComment'
import FeedbackAttachment from './FeedbackAttachment'
import NotFound from '../../../shared/components/NotFound/NotFound'
import FeedbackCommentField from '../../../components/Feedback/FeedbackCommentField'

const FeedbackDetailContainer = () => {
  const [comment, setComment] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const isMobile = useIsMobile()

  const { id } = useParams()
  const headers = useAuthHeader()
  const theme = useTheme()
  const payload = usePayload({
    content: comment,
    feedback: {
      id: Number(id),
    },
    leaf: false,
  })

  const { data, error, isLoading, mutate } = useSWR(`/api/feedback/${id}`, () => getFeedbacksById(headers, Number(id)))
  const leafComments = useMemo(() => data?.comments && data?.comments.filter((comment) => comment.leaf === false), [data])

  const handleChangeComment = (e) => {
    setComment(e.target.value)
  }

  const handleCancel = () => {
    setComment('')
  }

  const handleAddComment = () => {
    fetchSaveComment()
    if (inputRef.current) {
      inputRef.current.setSelectionRange(0, 0)
    }
    setComment('')
  }

  const handleAddInnerComment = async (content, comment) => {
    try {
      const payload = {
        content: content,
        feedback: {
          id: Number(id),
        },
        leaf: true,
        parentComment: {
          id: comment.id,
        },
      }
      const response = await saveFeedbackComment(generatePayload(payload))
      const updateReplies = (comments) => {
        return comments.map((search) => {
          if (search.id === comment.id) {
            return {
              ...search,
              replies: search.replies
                ? [
                    ...search.replies,
                    {
                      ...response,
                      replies: [],
                    },
                  ]
                : [
                    {
                      ...response,
                      replies: [],
                    },
                  ],
            }
          } else if (search.replies && search.replies.length > 0) {
            return {
              ...search,
              replies: updateReplies(search.replies),
            }
          }
          return search
        })
      }
      const updatedComments = updateReplies(data && data.comments)
      data && mutate({ ...data, comments: updatedComments }, false)
      notify('Yorum başarıyla eklendi')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchSaveComment = async () => {
    try {
      const response = await saveFeedbackComment(payload)
      let updatedResponse = {
        ...response,
        replies: response.replies ? response.replies : [],
      }
      const updatedComments = [...data.comments, updatedResponse]
      mutate({ ...data, comments: updatedComments }, false)
      notify('Yorum başarıyla eklendi')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleUpdateComment = async (id, content) => {
    try {
      const updatePayload = {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          id,
          content,
        }),
      }
      const response = await updateFeedbackComment(updatePayload)
      const updateComment = (comments) => {
        return comments.map((comment) => {
          if (comment.id === id) {
            return {
              ...comment,
              content: response.content,
            }
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateComment(comment.replies),
            }
          }
          return comment
        })
      }
      const updatedComments = updateComment(data.comments)
      mutate({ ...data, comments: updatedComments }, false)
      notify('Yorum başarıyla güncellendi')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleDeleteComment = async (id) => {
    try {
      await deleteFeedbackComment(id, headers)
      const updateComment = (comments) => {
        return comments
          .map((comment) => {
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateComment(comment.replies),
              }
            }
            return comment
          })
          .filter((comment) => comment.id !== id)
      }
      const updatedComments = updateComment(data.comments)
      data && mutate({ ...data, comments: updatedComments }, false)
      notify('Yorum başarıyla silindi')
    } catch (error) {
      notifyError(error.message)
    }
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h3" color="error">
          Bir hata oluştu
        </Typography>
      </Box>
    )
  }

  return (
    <Grid
      container
      spacing={2}
      sx={{
        p: 1,
      }}
    >
      <Grid
        container
        direction={'column'}
        spacing={2}
        size={isMobile ? 12 : 8}
        sx={{
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 1,
          }}
        >
          <Button variant="text" startIcon={<KeyboardBackspaceIcon />} onClick={() => window.history.back()}>
            TALEPLER
          </Button>
        </Box>
        <Grid
          sx={{
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography
              align="left"
              variant="h5"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
              }}
            >
              {data?.title ? FeedbackTitle[data.title] : ''}
            </Typography>
            <Chip label={data?.status ? FeedbackStatus[data.status] : ''} color={data?.status === 'Tamamlandı' ? 'success' : 'warning'} />
          </Box>
        </Grid>
        <Grid
          sx={{
            width: '100%',
          }}
        >
          <Divider />
        </Grid>
        <Grid
          sx={{
            minHeight: 300,
            bgcolor: theme.palette.action.hover,
            width: '100%',
            mt: 2,
            borderRadius: theme.shape.borderRadius,
            p: 2,
          }}
        >
          <Typography
            align="left"
            variant="body1"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
            }}
          >
            {data?.description}
          </Typography>
        </Grid>
        <Grid
          sx={{
            width: '100%',
          }}
        >
          <Box>
            <Typography
              align="left"
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
              }}
            >
              Yorumlar
            </Typography>
            <FeedbackCommentField comment={comment} inputRef={inputRef} handleChangeComment={handleChangeComment} handleAddComment={handleAddComment} handleCancel={handleCancel} />
          </Box>
          {leafComments !== undefined ? (
            leafComments.length === 0 ? (
              <NotFound msg={'Yorum Bulunamadı'} />
            ) : (
              leafComments.map((comment) => (
                <FeedbackComment
                  key={comment.id}
                  comment={comment}
                  theme={theme}
                  index={comment.id}
                  handleAddInnerComment={handleAddInnerComment}
                  handleUpdateComment={handleUpdateComment}
                  handleDeleteComment={handleDeleteComment}
                />
              ))
            )
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
      {!isMobile && (
        <Grid size={4}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              align="left"
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
              }}
            >
              Ekler
            </Typography>
            <Button onClick={() => setOpen(true)} sx={{ fontSize: 10, borderRadius: 10 }} endIcon={<OpenInFullIcon />} variant="outlined">
              Tüm Ekleri Gör
            </Button>
          </Box>
          {data?.uploads.length === 0 ? (
            <NotFound msg={'Ek bulunmadı'} />
          ) : (
            data?.uploads.map((upload, index) => <FeedbackAttachment key={index} upload={upload} theme={theme} index={index} />)
          )}
        </Grid>
      )}
      <ImageViewer
        open={open}
        onClose={() => setOpen(false)}
        slides={
          data
            ? data.uploads.map((upload) => ({
                src: upload.url,
                caption: upload.name,
              }))
            : []
        }
      />
    </Grid>
  )
}

export default FeedbackDetailContainer
