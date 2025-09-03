class Char {

    _life = 1;
    _maxMana = 100;
    maxLife = 1;
    mana = 0;
    attack = 0;
    defence = 0;

    constructor(name) {
        this.name = name;
    }

    get life() {
        return this._life;
    }

    set life(newLife) {
        //Se a vida for menor que 0, o valor deve ser 0, se não, continua com a % da vida.
        this._life = newLife < 0 ? 0 : newLife;
    }

    get manaMax() {
        return this._maxMana;
    }

    set manaMax(newMana) {
        this._maxMana = newMana > 100 ? 100 : newMana;
    }

}

class knight extends Char {
    constructor() {
        super("Knight");
        this.life = 100;
        this.attack = 10;
        this.defence = 17;
        this.mana = 0;
        this._maxMana = 100;
        this.maxLife = this.life;

    }

    special(target, log) {
        let damage = Math.max(1, this.attack * 2 - target.defence);
        target.life -= damage;
        if(target.life < 0) target.life = 0;
        log.addMessage(`${this.name} usou o ataque especial e causou ${damage} de dano!`);
    }

}

class Mage extends Char {
    constructor() {
        super("Mage");
        this.life = 80;
        this.attack = 19;
        this.defence = 5;
        this.mana = 0;
        this._maxMana = 100;
        this.maxLife = this.life;
    }

    special(target, log) {
        let healthRestored = Math.min(20, this.maxLife - this.life);
        this.life += healthRestored;
        log.addMessage(`${this.name} usou o ataque especial e recuperou ${healthRestored} de vida!`);
    }
}

class Archer extends Char {
    constructor() {
        super("Archer");
        this.life = 120;
        this.attack = 7;
        this.defence = 10;
        this.mana = 0;
        this._maxMana = 100;
        this.maxLife = this.life;
    }

    special(target, log) {
        let damage = Math.max(1, this.attack * 3 - target.defence);
        target.life -= damage;
        if(target.life < 0) target.life = 0;
        log.addMessage(`${this.name} usou o ataque especial e causou ${damage} de dano!`);
    }
}

class Vampire extends Char {
    constructor() {
        super("Vampire");
        this.life = 90;
        this.attack = 13;
        this.defence = 9;
        this.mana = 0;
        this._maxMana = 100;
        this.maxLife = this.life;
    }
}

class Werewolf extends Char {
    constructor() {
        super("Werewolf");
        this.life = 110;
        this.attack = 11;
        this.defence = 8;
        this.mana = 0;
        this._maxMana = 100;
        this.maxLife = this.life;
    }
}

class Demon extends Char {
    constructor() {
        super("Demon");
        this.life = 150;
        this.attack = 20;
        this.defence = 1;
        this.mana = 0;
        this._maxMana = 100;
        this.maxLife = this.life;
    }
}

class Stage {
    constructor(fighter1, fighter2, fighterEl1, fighterEl2, fighterSp1, fighterSp2, logObject) {
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        this.fighterEl1 = fighterEl1;
        this.fighterEl2 = fighterEl2;
        this.fighterSp1 = fighterSp1;
        this.fighterSp2 = fighterSp2;
        this.log = logObject;

        this.currentTurn = fighter1; // quem começa
    }

    start() {
        this.update();

        this.fighterEl1.querySelector('.attackButton')
            .addEventListener('click', () => this.doAttack(this.fighter1, this.fighter2));
        this.fighterEl2.querySelector('.attackButton')
            .addEventListener('click', () => this.doAttack(this.fighter2, this.fighter1));
        this.fighterEl1.querySelector('.special')
            .addEventListener('click', () => this.doSpecial(this.fighter1, this.fighter2));
        this.fighterEl2.querySelector('.special')
            .addEventListener('click', () => this.doSpecial(this.fighter2, this.fighter1));

        this.log.addMessage(`É a vez de ${this.currentTurn.name}!`);
    }

    update() {
        // limita vida e mana
        [this.fighter1, this.fighter2].forEach(f => {
            if(f.life > f.maxLife) f.life = f.maxLife;
            if(f.mana > f.manaMax) f.mana = f.manaMax;
        });

        // fighter1
        this.fighterEl1.querySelector('.name').innerHTML = 
            `${this.fighter1.name} - ${this.fighter1.life.toFixed(0)} HP - ${this.fighter1.mana.toFixed(0)} MP`;
        this.fighterEl1.querySelector('.bar').style.width = 
            Math.min((this.fighter1.life / this.fighter1.maxLife) * 100, 100) + '%';
        this.fighterEl1.querySelector('.MP').style.width = 
            Math.min((this.fighter1.mana / this.fighter1.manaMax) * 100, 100) + '%';

        // fighter2
        this.fighterEl2.querySelector('.name').innerHTML = 
            `${this.fighter2.name} - ${this.fighter2.life.toFixed(0)} HP - ${this.fighter2.mana.toFixed(0)} MP`;
        this.fighterEl2.querySelector('.bar').style.width = 
            Math.min((this.fighter2.life / this.fighter2.maxLife) * 100, 100) + '%';
        this.fighterEl2.querySelector('.MP').style.width = 
            Math.min((this.fighter2.mana / this.fighter2.manaMax) * 100, 100) + '%';
    }

    doAttack(attacking, attacked) {
        if(this.currentTurn !== attacking) {
            this.log.addMessage(`Não é a vez de ${attacking.name}!`);
            return;
        }

        if(attacking.life <= 0) {
            this.log.addMessage(`${attacking.name} está derrotado!`);
            return;
        }
        if(attacked.life <= 0) {
            this.log.addMessage(`${attacked.name} foi derrotado!`);
            return;
        }

        // cálculo do dano
        let attackFactor = parseFloat((Math.random() * 2 * (100 / (100 + attacked.defence))).toFixed(2));
        let actualAttack = Math.max(1, attacking.attack * attackFactor);

        // aplica dano
        attacked.life -= actualAttack;
        if(attacked.life < 0) attacked.life = 0;

        this.log.addMessage(`${attacking.name} causou ${actualAttack.toFixed(0)} de dano em ${attacked.name}`);

        // ganho de mana
        attacking.mana += Math.floor(actualAttack * 1.0); // atacante
        if(attacking.mana > attacking.manaMax) attacking.mana = attacking.manaMax;

        attacked.mana += Math.floor(actualAttack * 0.3); // defensor
        if(attacked.mana > attacked.manaMax) attacked.mana = attacked.manaMax;

        // ativa passiva do defensor se existir
        if(typeof attacked.passive === 'function') {
            attacked.passive(actualAttack, this.log);
        }

        this.update();
        this.endTurn();
    }

    doSpecial(attacking, attacked) {
        if(this.currentTurn !== attacking) {
            this.log.addMessage(`Não é a vez de ${attacking.name}!`);
            return;
        }

        if(attacking.mana >= attacking.manaMax) {
            attacking.special(attacked, this.log);
            attacking.mana = 0;
            this.update();
            this.endTurn();
        } else {
            this.log.addMessage(`${attacking.name} não tem mana suficiente para usar a habilidade especial.`);
        }
    }

    endTurn() {
        // alterna turno
        this.currentTurn = this.currentTurn === this.fighter1 ? this.fighter2 : this.fighter1;
        this.log.addMessage(`É a vez de ${this.currentTurn.name}!`);
    }
}


class Log {
    list = [];
    
    constructor(listEl) {
        this.listEl = listEl;
    }

    addMessage(msg) {
        this.list.push(msg);
        this.render();
    }

    render() {
        this.listEl.innerHTML = '';

        for(let i in this.list) {
            this.listEl.innerHTML += `<li>${this.list[i]}</li>`;
        }
    }
}