import axios from 'axios'
import { browserHistory } from 'react-router'
import apiConfig from 'vcfg/apiConfig'
// console.log(apiConfig)

export const requestAuthInstance = axios.create({
  baseURL: apiConfig.apiBaseUrl,
  headers: {
    'Authorization': localStorage.getItem('access_token') || null,
    'User-Id': localStorage.getItem('user_id') || null,
  }
})

export const requestInstance = axios.create({
  baseURL: apiConfig.apiBaseUrl
})

/**
 * Constants
 */
// Login.
export const AUTH_LOGIN_POSTS = 'AUTH_LOGIN_POSTS'
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS'
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE'

// Logout.
export const AUTH_LOGOUT_POSTS = 'AUTH_LOGOUT_POSTS'
export const AUTH_LOGOUT_SUCCESS = 'AUTH_LOGOUT_SUCCESS'
export const AUTH_LOGOUT_FAILURE = 'AUTH_LOGOUT_FAILURE'

// Register.
export const AUTH_REGISTER_POSTS = 'AUTH_REGISTER_POSTS'
export const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS'
export const AUTH_REGISTER_FAILURE = 'AUTH_REGISTER_FAILURE'

// Validate Token.
export const VALIDATE_TOKEN_POSTS = 'VALIDATE_TOKEN_POSTS'
export const VALIDATE_TOKEN_SUCCESS = 'VALIDATE_TOKEN_SUCCESS'
export const VALIDATE_TOKEN_FAILURE = 'VALIDATE_TOKEN_FAILURE'

/**
 * Actions
 */
export const requestLoginPosts = () => {
  return {
    type: AUTH_LOGIN_POSTS
  }
}

export const requestLoginSuccess = (data) => {
  return {
    type: AUTH_LOGIN_SUCCESS,
    payload: {
      data
    }
  }
}

export const requestLoginFailure = () => {
  return {
    type: AUTH_LOGIN_FAILURE
  }
}

export const requestLogoutPosts = () => {
  return {
    type: AUTH_LOGOUT_POSTS
  }
}

export const requestLogoutSuccess = (data) => {
  return {
    type: AUTH_LOGOUT_SUCCESS,
    payload: {
      data
    }
  }
}

export const requestLogoutFailure = () => {
  return {
    type: AUTH_LOGOUT_FAILURE
  }
}

export const requestRegisterPosts = () => {
  return {
    type: AUTH_REGISTER_POSTS
  }
}

export const requestRegisterSuccess = (data) => {
  return {
    type: AUTH_REGISTER_SUCCESS,
    payload: {
      data
    }
  }
}

export const requestRegisterFailure = () => {
  return {
    type: AUTH_REGISTER_FAILURE
  }
}

export const validateTokenPosts = () => {
  return {
    type: VALIDATE_TOKEN_POSTS
  }
}

export const validateTokenSuccess = (data) => {
  return {
    type: VALIDATE_TOKEN_SUCCESS,
    payload: {
      data
    }
  }
}

export const validateTokenFailure = () => {
  return {
    type: VALIDATE_TOKEN_FAILURE
  }
}

/**
 * Method.
 */

export const handleLogin = (loginData, callback) => {
  return (dispatch) => {
    dispatch(requestLoginPosts())

    return requestInstance.get(apiConfig.apiList.auth.login, {
      params: {
        ...loginData,
        'rnd': (new Date()).getTime()
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          const { userid, accesstoken } = res.data.data
          dispatch(requestLoginSuccess(res.data.data))
          console.log(accesstoken)
          localStorage.setItem('access_token', accesstoken)
          localStorage.setItem('user_id', userid)
          callback && callback()
        } else {
          dispatch(requestLoginFailure())
        }
      })
      .catch(err => {
        dispatch(requestLoginFailure())
        console.log(err)
      })
  }
}

export const handleLogout = (callback) => {
  return (dispatch) => {
    dispatch(requestLogoutPosts())
    try {
      // Clear local access_token & user_id
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_id')
      dispatch(requestLogoutSuccess())
      callback && callback()
    } catch (err) {
      console.log(err)
      dispatch(requestLogoutFailure())
    }
  }
}

export const handleRegister = (registerData, callback) => {
  return (dispatch) => {
    dispatch(requestRegisterPosts())

    return requestInstance.get(apiConfig.apiList.auth.register, {
      params: {
        ...registerData,
        'rnd': (new Date()).getTime()
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          const { userid, accesstoken } = res.data.data
          dispatch(requestRegisterSuccess(res.data.data))
          console.log(accesstoken)
          localStorage.setItem('access_token', accesstoken)
          localStorage.setItem('user_id', userid)
          callback && callback()
        } else {
          dispatch(requestRegisterFailure())
        }
      })
      .catch(err => {
        dispatch(requestRegisterFailure())
        console.log(err)
      })
  }
}

export const handleValidateToken = () => {
  return (dispatch) => {
    dispatch(validateTokenPosts())

    return requestInstance.get(apiConfig.apiList.auth.validateToken, {
      headers: {
        'Authorization': localStorage.getItem('access_token') || null,
        'User-Id': localStorage.getItem('user_id') || null,
      },
      params: {
        'rnd': (new Date()).getTime()
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          const { userid, accesstoken } = res.data.data
          // console.log(accesstoken)
          localStorage.setItem('access_token', accesstoken)
          localStorage.setItem('user_id', userid)
          dispatch(validateTokenSuccess(res.data.data))
        } else {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user_id')
          dispatch(validateTokenFailure())
          browserHistory.push('/')
        }
      })
      .catch(err => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_id')
        dispatch(validateTokenFailure())
        browserHistory.push('/')
        console.log(err)
      })
  }
}

/**
 * Action Handlers
 */
const AUTH_ACTION_HANDLERS = {
  [AUTH_LOGIN_POSTS]: (state) => {
    return ({
      ...state,
      isLoading: true
    })
  },
  [AUTH_LOGIN_SUCCESS]: (state, action) => {
    return ({
      ...state,
      isLoading: false,
      isAuthenticated: true,
      userId: action.payload.data.userid,
      accessToken: action.payload.data.accesstoken
    })
  },
  [AUTH_LOGIN_FAILURE]: (state) => {
    return ({
      ...state,
      isLoading: false
    })
  },
  [AUTH_LOGOUT_POSTS]: (state) => {
    return ({
      ...state,
      isLoading: true
    })
  },
  [AUTH_LOGOUT_SUCCESS]: (state, action) => {
    return ({
      ...state,
      isLoading: false,
      isAuthenticated: false,
      userId: null,
      accessToken: null
    })
  },
  [AUTH_LOGOUT_FAILURE]: (state) => {
    return ({
      ...state,
      isLoading: false
    })
  },
  [AUTH_REGISTER_POSTS]: (state) => {
    return ({
      ...state,
      isLoading: true
    })
  },
  [AUTH_REGISTER_SUCCESS]: (state, action) => {
    return ({
      ...state,
      isLoading: false,
      isAuthenticated: true,
      userId: action.payload.data.userid,
      accessToken: action.payload.data.accesstoken
    })
  },
  [AUTH_REGISTER_FAILURE]: (state) => {
    return ({
      ...state,
      isLoading: false
    })
  },
  [VALIDATE_TOKEN_POSTS]: (state) => {
    return ({
      ...state,
      isLoading: true
    })
  },
  [VALIDATE_TOKEN_SUCCESS]: (state, action) => {
    return ({
      ...state,
      isLoading: false,
      isAuthenticated: true,
      userId: action.payload.data.userid,
      accessToken: action.payload.data.accesstoken
    })
  },
  [VALIDATE_TOKEN_FAILURE]: (state) => {
    return ({
      ...state,
      isLoading: false,
      isAuthenticated: false,
      userId: null,
      accessToken: null
    })
  },
}

/**
 * Reducers
 */
const initialState = {
  isLoading: false,
  isAuthenticated: !!(localStorage.getItem('access_token') && localStorage.getItem('user_id')) || false,
  userId: localStorage.getItem('user_id') || null,
  accessToken: localStorage.getItem('access_token') || null
}

export default function authReducer (state = initialState, action) {
  const handler = AUTH_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}