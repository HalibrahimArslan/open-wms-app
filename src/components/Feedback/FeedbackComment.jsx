import { Avatar, Box, Chip, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useEffect, useRef, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import FeedbackCommentField from './FeedbackCommentField'
import MoreVertButton from '../MenuWrapper/MoreVertButton'

const FeedbackComment = ({ comment, theme, index, handleAddInnerComment, handleUpdateComment, handleDeleteComment }) => {
  const [open, setOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const [innerComment, setInnercomment] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const inputRef = useRef(null)
  const { account } = useContainer(DataStore)

  useEffect(() => {
    if (isEdit) {
      setInnercomment(comment.content)
    } else {
      setInnercomment('')
    }
  }, [isEdit, comment.content])

  const handleAddComment = () => {
    handleAddInnerComment(innerComment, comment)
    setInnercomment('')
    setCommentOpen(!commentOpen)
  }

  const handleUpdateCommentWrapper = () => {
    handleUpdateComment(comment.id, innerComment)
    setIsEdit(false)
  }

  return (
    <Box
      key={index}
      display={'flex'}
      justifyContent={'flex-start'}
      gap={0.25}
      padding={2}
      mb={2}
      borderRadius={theme.shape.borderRadius}
      border={`1px solid ${theme.palette.grey[300]}`}
      position={'relative'}
    >
      <Avatar alt={comment.createdBy}>{comment.createdBy[0].toUpperCase()}</Avatar>
      <Box display={'flex'} flexDirection={'column'} padding={2} gap={1} overflow={'auto'} width={'100%'}>
        {isEdit ? (
          <FeedbackCommentField
            inputRef={inputRef}
            comment={innerComment}
            handleChangeComment={(e) => setInnercomment(e.target.value)}
            handleAddComment={handleUpdateCommentWrapper}
            handleCancel={() => {
              setInnercomment('')
              setIsEdit(false)
            }}
          />
        ) : (
          <Typography align="left" variant="body1" style={{ wordWrap: 'break-word' }} fontWeight={theme.typography.fontWeightMedium}>
            {comment.content}
          </Typography>
        )}

        <Box display={'flex'} justifyContent={'flex-start'} gap={1}>
          {commentOpen && (
            <FeedbackCommentField
              inputRef={inputRef}
              comment={innerComment}
              handleChangeComment={(e) => setInnercomment(e.target.value)}
              handleAddComment={handleAddComment}
              handleCancel={() => {
                setInnercomment('')
                setCommentOpen(!commentOpen)
              }}
            />
          )}
          {!commentOpen && (
            <Chip
              sx={{ width: '100px' }}
              label={'Yanıtla'}
              onDelete={() => {
                setCommentOpen(!commentOpen)
              }}
              deleteIcon={<KeyboardArrowDownIcon />}
            />
          )}

          {comment.replies.length > 0 && !commentOpen && (
            <Chip
              sx={{ width: '100px' }}
              label={`${comment.replies.length} Yanıt`}
              onDelete={() => {
                setOpen(!open)
              }}
              deleteIcon={<KeyboardArrowDownIcon />}
            />
          )}
        </Box>
        {open &&
          comment.replies.map((reply, index) => (
            <FeedbackComment
              key={index}
              comment={reply}
              theme={theme}
              index={index}
              handleAddInnerComment={handleAddInnerComment}
              handleUpdateComment={handleUpdateComment}
              handleDeleteComment={handleDeleteComment}
            />
          ))}
      </Box>
      <Box position={'absolute'} top={5} right={5}>
        {comment.createdDate.split('T')[0]} {comment.createdDate.split('T')[1].split('.')[0]}
        {account?.login === comment.createdBy && (
          <MoreVertButton
            btnList={[
              {
                id: comment.id,
                name: 'Sil',
                onClick: () => {
                  handleDeleteComment(comment.id)
                },
                icon: <DeleteIcon />,
              },
              {
                id: comment.id,
                name: 'Düzenle',
                onClick: () => {
                  setIsEdit(!isEdit)
                },
                icon: <EditIcon />,
              },
            ]}
          />
        )}
      </Box>
    </Box>
  )
}

export default FeedbackComment
