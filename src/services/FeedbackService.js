import { getErrorMessage } from '../utils/Utils'

export async function saveFeedback(payload) {
  const response = await fetch('/api/feedback', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const uploadList = await response.json()
  return uploadList
}

export async function getFeedbacks(headers, query) {
  const response = await fetch(`/api/feedbacks?${query}`, { headers })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const feedbacks = await response.json()

  return feedbacks
}

export async function getFeedbacksById(headers, id) {
  const response = await fetch(`/api/feedback/${id}`, { headers })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const feedback = await response.json()

  return feedback
}

export async function saveFeedbackComment(payload) {
  const response = await fetch('/api/feedback-comment', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const savedComment = await response.json()
  return savedComment
}

export async function updateFeedback(payload) {
  const response = await fetch('/api/feedbacks', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const updatedFeedback = await response.json()
  return updatedFeedback
}

export async function updateFeedbackComment(payload) {
  const response = await fetch('/api/feedback-comments', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const updatedFeedbackComment = await response.json()
  return updatedFeedbackComment
}

export async function deleteFeedbackComment(id, headers) {
  const response = await fetch(`/api/feedback-comment/${id}`, {
    method: 'DELETE',
    headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
