import { Box, Heading } from '@chakra-ui/react';

export function Header() {
  return (
    <Box
      as='section'
      color='gray.50'
      bg='purple.600'
      pt={['40px', '40px', '60px']}
      pb='100px'
      px='8'
      textAlign={['left', 'left', 'center']}
    >
      <Heading fontWeight='extrabold' fontSize={['3xl', '3xl', '5xl']}>
        Mayhem Lockpick Challenge
      </Heading>
    </Box>
  );
}

export default Header;