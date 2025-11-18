import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className="h-6 w-6"
      {...props}
    >
      <title>ABN Studio Logo</title>
       <path
        d="M128,32A96,96,0,1,0,224,128,96.11,96.11,0,0,0,128,32Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,208Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M176.24,99.28,150.1,125.42l26.14,26.14a8,8,0,0,1-11.32,11.32L138.78,136.74,112.64,162.88a8,8,0,0,1-11.32-11.32l26.14-26.14L101.32,99.28a8,8,0,0,1,11.32-11.32l26.14,26.14,26.14-26.14a8,8,0,0,1,11.32,11.32Z"
        fill="currentColor"
      />
    </svg>
  );
}
