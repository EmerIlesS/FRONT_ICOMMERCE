import {Button, VStack } from "@chakra-ui/react";

export default function Login() {
    return  <VStack p={8}>
        
        <input placeholder="email" type="email" />
        <input placeholder="password" type="password" />
        <Button colorScheme="teel">ingresar</Button>
    </VStack>
}   
