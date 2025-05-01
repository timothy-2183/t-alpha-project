import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Home, Cog} from 'lucide-react';
import sidebar from './Sidebar.module.css';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (route) => currentPath === route;

  const buttonClass = (route) => {
    return isActive(route)
      ? `${sidebar.button} ${sidebar.active}`
      : `${sidebar.button} ${sidebar.inactive}`;
  };

  return (
    <aside
      style={{ '--sidebar-width': isExpanded ? '7rem' : '3.5rem' }}
      className="
        fixed left-0 top-0
        h-dvh
        w-[var(--sidebar-width)]
        border-r border-gray-700
        bg-gray-800 text-white
        transition-width duration-400 ease-in-out
      "
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="flex h-full flex-col justify-center space-y-4 px-2">
        <Link to="">
          <button
            className={`
              ${buttonClass('/')} 
              flex items-center
              transition-width duration-400 ease-in-out
              ${isExpanded ? 'px-3 w-full' : 'px-2 w-10'}
              overflow-hidden whitespace-nowrap
            `}
          >
            <div className="flex items-center justify-center">
              <Home size={20} />
            </div>
            <span className="ml-2.5">
              Home
            </span>
          </button>
        </Link>

        <Link to="/demo1">
          <button
            className={`
              ${buttonClass('/demo1')} 
              flex items-center
              transition-all duration-400 ease-in-out
              ${isExpanded ? 'px-3 w-full' : 'px-2 w-10'}
              overflow-hidden whitespace-nowrap
            `}
          >
            <div className="flex items-center justify-center">
              <Cog size={20} />
            </div>
            <span className="ml-2.5">
              Demo1
            </span>
          </button>
        </Link>

        <Link to="/demo2">
          <button
            className={`
              ${buttonClass('/demo2')} 
              flex items-center
              transition-all duration-400 ease-in-out
              ${isExpanded ? 'px-3 w-full' : 'px-2 w-10'}
              overflow-hidden whitespace-nowrap
            `}
          >
            <div className="flex items-center justify-center">
              <Cog size={20} />
            </div>
            <span className="ml-2.5">
              Demo2
            </span>
          </button>
        </Link>

      </nav>
    </aside>
  );
}
