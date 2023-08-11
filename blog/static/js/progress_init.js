NProgress.start();

$(document).ready(function() {
    NProgress.done();
    setTimeout(() => {
        NProgress.remove();
    }, 2000)
})
