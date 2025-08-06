setInterval(function() {
    if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {

        window.close(); 
    }
}, 1000);
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I' || e.ctrlKey && e.key.toLowerCase() === 'u')) {
        e.preventDefault();
    }
});