import React from 'react';
import { Link } from 'react-router-dom';
import useScrollToTop from '../hooks/useScrollToTop';

/**
 * A Link component that automatically scrolls to top when clicked
 * 
 * @param {Object} props - Component props
 * @param {string} props.to - The path to navigate to
 * @param {boolean} props.smooth - Whether to use smooth scrolling (default: true)
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.className - CSS class names
 * @returns {JSX.Element} Link component that scrolls to top
 */
const ScrollToTopLink = ({ to, smooth = true, children, className, ...rest }) => {
  const navigateAndScrollToTop = useScrollToTop();
  
  const handleClick = (e) => {
    e.preventDefault();
    navigateAndScrollToTop(to, { smooth });
  };
  
  return (
    <Link 
      to={to} 
      onClick={handleClick} 
      className={className} 
      {...rest}
    >
      {children}
    </Link>
  );
};

export default ScrollToTopLink; 