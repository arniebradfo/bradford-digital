"use client";

import { useLayoutEffect } from "react";

export const AsciiArt = () => {
  useLayoutEffect(() => {
    if (document) {
      const asciiArtComment = document?.createComment(asciiArt);
      document.firstElementChild?.prepend(asciiArtComment);
      return () => asciiArtComment.remove();
    } else {
      console.warn({ asciiArt });
    }
  });
  return null;
};

export const asciiArt = `

         |¯-_    
    _-_  |   |   
   |   | |   |   
    ¯-¯  |   ¯-_ 
    _-¯|  ¯-_   |
   |   |  _-¯   |
   |   | ¯-_ _-¯ 
 _-¯   |    ¯    
¯-_ _-¯          
   ¯
   
   JAMES BRADFORD / UX ENGINEER
   ---
   Take a look at the site source code:
   https://github.com/arniebradfo/bradford-digital

`;

if (typeof window !== 'undefined') console.log(asciiArt);
