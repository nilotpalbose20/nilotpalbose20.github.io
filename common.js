document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('topBarThemeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    function applyTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.title = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme(true);
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        applyTheme(isDark);
    });
    
    // Sidebar Toggle
    const topBarSidebarToggle = document.getElementById('topBarSidebarToggle');
    const mobileSidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent-mos') || document.getElementById('mainContent');
    
    function toggleSidebar() {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('active');
        } else {
            sidebar.classList.toggle('hidden');
            mainContent.classList.toggle('sidebar-hidden');
            localStorage.setItem('sidebarHidden', sidebar.classList.contains('hidden'));
        }
    }
    
    topBarSidebarToggle.addEventListener('click', toggleSidebar);
    mobileSidebarToggle.addEventListener('click', toggleSidebar);
    
    // Initialize sidebar state
    if (window.innerWidth > 768 && localStorage.getItem('sidebarHidden') === 'true') {
        sidebar.classList.add('hidden');
        mainContent.classList.add('sidebar-hidden');
    }
    
    // Remove active class from all dropdown triggers on page load
    const dropdownTriggers = document.querySelectorAll('.has-dropdown');
    dropdownTriggers.forEach(trigger => {
        trigger.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        
        // Find and close all dropdown menus on page load
        const dropdownMenu = trigger.nextElementSibling;
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-submenu')) {
            dropdownMenu.classList.remove('show');
            
            // Reset dropdown icons
            const dropdownIcon = trigger.querySelector('.dropdown-icon');
            if (dropdownIcon) {
                dropdownIcon.classList.remove('rotated');
            }
        }
    });
    
    // Dropdown functionality for all dropdowns
    const dropdownLinks = document.querySelectorAll('.has-dropdown');
    
    dropdownLinks.forEach(link => {
        const dropdownIcon = link.querySelector('.dropdown-icon');
        const dropdownMenu = link.nextElementSibling;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other open dropdowns
            document.querySelectorAll('.dropdown-submenu.show').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                    const otherIcon = menu.previousElementSibling.querySelector('.dropdown-icon');
                    if (otherIcon) otherIcon.classList.remove('rotated');
                    menu.previousElementSibling.setAttribute('aria-expanded', 'false');
                    menu.previousElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            const isExpanding = !dropdownMenu.classList.contains('show');
            dropdownMenu.classList.toggle('show');
            dropdownIcon.classList.toggle('rotated');
            link.setAttribute('aria-expanded', dropdownMenu.classList.contains('show'));
            
            // Toggle active class
            if (isExpanding) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.has-dropdown') && !e.target.closest('.dropdown-submenu')) {
            document.querySelectorAll('.dropdown-submenu.show').forEach(menu => {
                menu.classList.remove('show');
                const icon = menu.previousElementSibling.querySelector('.dropdown-icon');
                if (icon) icon.classList.remove('rotated');
                menu.previousElementSibling.setAttribute('aria-expanded', 'false');
                menu.previousElementSibling.classList.remove('active');
            });
        }
    });
    
    // Active section highlighting
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    let scrollTimeout;
    
    function updateActiveSection() {
        let current = '';
        const sections = document.querySelectorAll('.content-section');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
                
                // Also expand parent dropdown if needed
                const parentDropdown = link.closest('.dropdown-submenu');
                if (parentDropdown) {
                    parentDropdown.classList.add('show');
                    const dropdownTrigger = parentDropdown.previousElementSibling;
                    if (dropdownTrigger) {
                        dropdownTrigger.setAttribute('aria-expanded', 'true');
                        const icon = dropdownTrigger.querySelector('.dropdown-icon');
                        if (icon) icon.classList.add('rotated');
                    }
                }
            }
        });
    }
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveSection, 100);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.classList.contains('has-dropdown')) return;
        
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile sidebar
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
                
                // Update active state after scroll
                setTimeout(updateActiveSection, 300);
            }
        });
    });
    
    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('active', window.scrollY > 300);
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mobile toggle button visibility
    window.addEventListener('resize', () => {
        const mobileToggle = document.getElementById('sidebarToggle');
        if (window.innerWidth <= 768) {
            mobileToggle.style.opacity = '1';
            mobileToggle.style.visibility = 'visible';
        } else {
            mobileToggle.style.opacity = '0';
            mobileToggle.style.visibility = 'hidden';
            sidebar.classList.remove('active');
        }
        
        // Close dropdowns on desktop when clicking outside
        if (window.innerWidth > 768) {
            // Already handled by the document click listener
        }
    });
    
    // Initialize
    updateActiveSection();
    window.dispatchEvent(new Event('resize'));
    
    // MathJax configuration with larger font size
    window.MathJax = {
        tex: {
            inlineMath: [['\\(', '\\)']],
            displayMath: [['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            // Increase the scale for better visibility
            scale: 1.2,
            // Ensure proper display
            displayAlign: 'center',
            displayIndent: '0em'
        },
        startup: {
            ready: () => {
                MathJax.startup.defaultReady();
                // Increase font size for all MathJax elements
                MathJax.typesetPromise().then(() => {
                    document.querySelectorAll('mjx-container').forEach(mjx => {
                        mjx.style.fontSize = '125%';
                    });
                });
            }
        }
    };
    
    // Increase formula font size via CSS
    const style = document.createElement('style');
    style.textContent = `
        .formula.mathjax {
            font-size: 1.8rem !important;
        }
        .formula.plain {
            font-size: 1.6rem !important;
        }
        mjx-container {
            font-size: 125% !important;
        }
        .formula-box .formula {
            font-size: 1.7rem !important;
        }
    `;
    document.head.appendChild(style);
    
    // Render MathJax after DOM is fully loaded
    setTimeout(() => {
        if (window.MathJax && window.MathJax.typeset) {
            window.MathJax.typesetPromise().then(() => {
                // Apply larger font size to all MathJax elements
                document.querySelectorAll('mjx-container').forEach(mjx => {
                    mjx.style.fontSize = '125%';
                });
            });
        }
    }, 500);
});