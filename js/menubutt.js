document.addEventListener('DOMContentLoaded', () => {
    const moreBtn = document.getElementById('morebutt');
    const closeBtn = document.getElementById('closebutt');
    const nav = document.getElementById('quickoptions');

    if (moreBtn && nav) {
        moreBtn.addEventListener('click', () => {
            nav.classList.add('show');
        });
    }

    if (closeBtn && nav) {
        closeBtn.addEventListener('click', () => {
            nav.classList.remove('show');
        });
    }
});