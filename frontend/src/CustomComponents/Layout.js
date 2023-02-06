import {styled, Box} from '@mui/material'

export const Flex = styled(Box)(({theme, ...props}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: props.bgcolor || "green"
}))