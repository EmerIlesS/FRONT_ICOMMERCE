import { Box, VStack } from "@chakra-ui/react";

import type  React  from "react";
export default function Register() {
    return <VStack  p={8}>
        <input placeholder="username" type="text" />
        <input placeholder="Email" />
        <input placeholder="Password" type="password"/>
        <input placeholder="Confirm Password" type="password"/>
        
            
    </VStack>    

}
