import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '@/component/ui/Header/Navbar';

function Header() {
  return (
    <header>
      <ChakraProvider>
        <Navbar />
      </ChakraProvider>
    </header>
  );
}

export default Header;