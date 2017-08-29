import {
  requestAuthInstance,
  ApiList
} from 'vstore/auth'

/**
 * Constants
 */
export const REQUEST_USERS_POSTS = 'REQUEST_USERS_POSTS'
export const REQUEST_USERS_SUCCESS = 'REQUEST_USERS_SUCCESS'
export const REQUEST_USERS_FAILURE = 'REQUEST_USERS_FAILURE'

/**
 * Actions
 */
export const requestListPosts = () => {
  return {
    type: REQUEST_USERS_POSTS
  }
}

export const requestListSuccess = (data) => {
  return {
    type: REQUEST_USERS_SUCCESS,
    payload: {
      data
    }
  }
}

export const requestListFailure = () => {
  return {
    type: REQUEST_USERS_FAILURE
  }
}

/**
 * Async method
 */
export const fetchList = () => {
  return (dispatch) => {
    dispatch(requestListPosts())

    return requestAuthInstance.get(ApiList.users.index, {
      params: {
        'rnd': (new Date()).getTime()
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          dispatch(requestListSuccess(res.data.data))
        } else {
          dispatch(requestListFailure())
        }
      })
      .catch(err => {
        dispatch(requestListFailure())
        console.log(err)
      })
  }
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const actions = {
}

/**
 * Action Handlers
 */
const ADMIN_USERS_ACTION_HANDLERS = {
  [REQUEST_USERS_POSTS]: (state) => {
    return ({
      ...state,
      isLoading: true
    })
  },
  [REQUEST_USERS_SUCCESS]: (state, action) => {
    return ({
      ...state,
      isLoading: false,
      userList: action.payload.data.list
    })
  },
  [REQUEST_USERS_FAILURE]: (state) => {
    return ({
      ...state,
      isLoading: false
    })
  },
}

/**
 * Reducer
 */
const initialState = {
  isLoading: false,
  userList: []
}

export default function UserReducer (state = initialState, action) {
  const handler = ADMIN_USERS_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}