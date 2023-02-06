import React, {useContext} from 'react'
import { UserContext } from '../context/UserContext'
import { Flex } from '../CustomComponents/Layout'

const Component2 = () => {

  const {logout} = useContext(UserContext)
  return (
    <Flex bgcolor={"red"}>

      <h1 onClick={logout}>logout</h1>
    </Flex>
  )
}

export default Component2