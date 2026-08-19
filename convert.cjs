const fs = require('fs');

let html = fs.readFileSync('user_stitch.html', 'utf8');

// Extract body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyContent = bodyMatch ? bodyMatch[1] : '';

// Remove script tags
bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// Convert class to className
bodyContent = bodyContent.replace(/class="/g, 'className="');

// Convert for attributes to htmlFor
bodyContent = bodyContent.replace(/for="/g, 'htmlFor="');

// Fix self-closing tags
bodyContent = bodyContent.replace(/<img([^>]+[^\/])>/g, '<img$1 />');
bodyContent = bodyContent.replace(/<input([^>]+[^\/])>/g, '<input$1 />');
bodyContent = bodyContent.replace(/<br>/g, '<br />');

// Fix SVG/HTML standard attributes (not perfect but handles basics like viewbox)
bodyContent = bodyContent.replace(/viewBox/gi, 'viewBox');
bodyContent = bodyContent.replace(/stroke-width/gi, 'strokeWidth');
bodyContent = bodyContent.replace(/stroke-linecap/gi, 'strokeLinecap');
bodyContent = bodyContent.replace(/stroke-linejoin/gi, 'strokeLinejoin');

// Fix inline styles
bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styles = styleString.split(';').filter(s => s.trim());
    const styleObj = {};
    styles.forEach(s => {
        let [key, ...valueParts] = s.split(':');
        let value = valueParts.join(':');
        if (key && value) {
            // Check for CSS variables
            key = key.trim();
            if (!key.startsWith('--')) {
                key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            }
            styleObj[key] = value.trim();
        }
    });
    return `style={${JSON.stringify(styleObj)}}`;
});

const component = `import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
          targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
          });
      }
    };
    anchors.forEach(anchor => anchor.addEventListener('click', handleClick));
    return () => anchors.forEach(anchor => anchor.removeEventListener('click', handleClick));
  }, []);

  return (
    <>
      ${bodyContent}
    </>
  );
}

export default App;
`;

fs.writeFileSync('src/App.jsx', component);
console.log('App.jsx created');
