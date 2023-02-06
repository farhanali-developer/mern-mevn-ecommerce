import React, {useContext} from 'react'
import { Flex } from '../CustomComponents/Layout'
import { UserContext } from '../context/UserContext'

const Component1 = () => {

  const {user, setUser, logout} = useContext(UserContext)

  return (
    <Flex>
        <h1>{JSON.stringify(user)}</h1>
        <h1>Farhan</h1>
        <h1>Farhan</h1>
    </Flex>
  )
}

export default Component1