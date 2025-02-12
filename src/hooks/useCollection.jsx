import { useContext, useReducer, useEffect } from 'react'
import { CollectionContext } from '../context/collection'
import uploadCollection from '../service/uploadCollection'
import gettingCollections from '../service/gettingCollections'
import md5 from 'md5'

const initialState = {}

function reducer(state, action) {
  if (action.type === 'SET_DATA') {
    window.localStorage.setItem('fileSystem', JSON.stringify(action.value))
    return action.value
  }

  if (action.type === 'ADD_ITEM') {
    const newEntry = { ...action.value }
    const namePath = newEntry.name.replace(' ', '-')
    newEntry.path = `${newEntry.path}/${namePath}`
    if (newEntry.type === 'folder') {
      newEntry.children = []
    }
    const id = md5(newEntry.path + newEntry.type)

    newEntry.id = id
    state.collections.push(newEntry)

    const index = state.collections.findIndex(item => item.id === newEntry.parentID)
    if (index !== -1) {
      state.collections[index].children.push(id)
    }
    window.localStorage.setItem('fileSystem', JSON.stringify(state))
    uploadCollection(state)
    return { ...state }
  }

  if (action.type === 'DELETE_ITEM') {
    const { id, parentID } = action.value
    const newState = { ...state }

    // Encuentra la entrada en la colección
    const index = state.collections.findIndex(item => item.id === id)
    const indexParent = state.collections.findIndex(item => item.id === parentID)
    const childIndexInParent = state.collections[indexParent].children.findIndex(item => item === id)
    const indexChildren = state.collections[index].children.map(child => {
      const index = state.collections.findIndex(item => item.id === child)
      return index
    })

    // Elimina la entrada de la colección

    for (let i = indexChildren.length - 1; i >= 0; i--) {
      newState.collections.splice(indexChildren[i], 1)
    }
    newState.collections.splice(index, 1)
    newState.collections[indexParent].children.splice(childIndexInParent, 1)

    // Actualiza el localStorage y vuelve a cargar la colección
    window.localStorage.setItem('fileSystem', JSON.stringify(state))
    uploadCollection(state)
    return { ...state }
  }

  // if (action.type === 'EDIT_NAME') {
  //   const { id, newName, newLink } = action.value
  //   const newState = { ...state }

  //   // Encuentra la entrada en la colección
  //   const index = state.collections.findIndex(item => item.id === id)

  //   // Elimina la entrada de la colección
  //   newState.collections[index].name = newName
  //   newState.collections[index].link = newLink

  //   const arrayPath = newState.collections[index].path.split('/')
  //   arrayPath.splice((arrayPath.length - 1), 1, newName)
  //   newState.collections[index].path = arrayPath.join('/')

  //   console.log('object :>> ', newState.collections[index].path + newState.collections[index].type)

  //   const parentID = md5(newState.collections[index].path + ' ' + newState.collections[index].type)
  //   newState.collections[index].id = parentID

  //   newState.collections[index].children.map(item => {
  //     const children = newState.collections.find(c => c.id === item)
  //     const tmpPath = children.path.split('/')
  //     const indexPath = tmpPath.findIndex(item => item === children.parentPath)
  //     tmpPath.splice(indexPath, 1, newName)

  //     children.parentID = parentID
  //     children.path = tmpPath.join('/')
  //     children.parentPath = newName
  //     return children
  //   })

  //   // Actualiza el localStorage y vuelve a cargar la colección
  //   window.localStorage.setItem('fileSystem', JSON.stringify(newState))
  //   uploadCollection(newState)
  //   return { ...newState }
  // }
}

function useCollection() {
  const {
    setCurrentView,
    setReload, reload,
    setListId
  } = useContext(CollectionContext)

  const [state, dispatch] = useReducer(reducer, initialState)

  const currentPath = window.location.href.split('/').pop()
  const pathFull = window.location.href.split('/')
  const index = pathFull.indexOf('collections')
  const entryPath = pathFull.splice(index).join('/')

  const addItem = (data) => {
    dispatch({
      type: 'ADD_ITEM',
      value: data
    })
  }

  const deleteItem = (data) => {
    dispatch({
      type: 'DELETE_ITEM',
      value: data
    })
  }

  const editItem = (data) => {
    dispatch({
      type: 'EDIT_NAME',
      value: data
    })
  }

  const setData = (data) => {
    dispatch({
      type: 'SET_DATA',
      value: data
    })
  }

  const updateCollectionStates = (state) => {
    setCurrentView(state || null)
    setListId(() => {
      if (!state[0]) return

      return currentPath === 'collections'
        ? state[0].children
        : state.find(c => c.path === entryPath).children
    })
  }

  // Actualiza estados con la respuesta de la base de datos

  useEffect(() => {
    gettingCollections()
      .then((res) => {
        const collections = res.user.collections

        setData(res.user)
        updateCollectionStates(collections)
      })
  }, [])

  useEffect(() => {
    const fileSystem = window.localStorage.getItem('fileSystem')
    const collections = fileSystem ? JSON.parse(fileSystem).collections : []

    updateCollectionStates(collections)
  }, [reload])

  useEffect(() => {
    const handleBackButton = () => {
      setReload(!reload)
    }

    window.addEventListener('popstate', handleBackButton)
    return () => {
      window.removeEventListener('popstate', handleBackButton)
    }
  }, [reload])

  return {
    state,
    setData,
    addItem,
    deleteItem,
    editItem,
    entryPath,
    currentPath
  }
}

export default useCollection
