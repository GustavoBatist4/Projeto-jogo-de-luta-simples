let log = new Log(document.querySelector('.log'));
let char = new knight();
let monster = new Demon();

let stage = new Stage(
    char,
    monster,

    document.querySelector('#char'),
    document.querySelector('#monster'),
    document.querySelector('#char .special'),
    document.querySelector('#monster .special'),
    log
);

stage.start();