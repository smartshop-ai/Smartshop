let cart = [];

const showSection = (id, btn) => {
    document.querySelectorAll('.content-section')
        .forEach(section => section.classList.add('hidden'));

    document.getElementById(id)
        .classList.remove('hidden');

    document.querySelectorAll('.nav-btn')
        .forEach(button => button.classList.remove('active'));

    if (btn) btn.classList.add('active');
};

const finalizeBill = () => {
    alert("Bill Generated Successfully!");
};
