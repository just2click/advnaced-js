
QUnit.test('Order WITH unintentional side effect.', (assert) => {
    var cardProto = {
        items: [],

        addItem: function addItem (item) {
            this.items.push(item);
        },
    },

    createCart = function (items) {
        var cart = Object.create(cardProto);
        // This line causes the test to fail, The stored cart is unchanged
        //cart.items = items;
        // Fixed
        cart.items = Object.create(items);
        return cart;
    },
    // Load cart with stored items
    savedCart = createCart(['apple', 'pear', 'orange']),

    session = {
        get: function get () {
            return this.cart;
        },

        // Grab the saved cart.
        cart: createCart(savedCart.items)
    };

    // addItems gets triggered by an event handler somewhere
    session.cart.addItem('grapefruit');

    assert.ok(session.cart.items.indexOf('grapefruit') !== -1, 'Passes: Session cart has grapefruit');
    assert.ok(savedCart.items.indexOf('grapefruit') === -1, 'Fails: The stored cart is unchanged');
});

var score = 6;
if (score > 5) {
    function grade() {
        return 'pass';
    }
} else {
    function grade() {
        return 'fail';
    }
}

QUnit.module('Pass or fail');

QUnit.test('Conditional function declaration.', (assert) => {
    assert.equal(grade(), 'pass', 'Grade should pass');
});


QUnit.test('Named functions expressions', (assert) => {
    var a = function x () {
        assert.ok(x, 'x() is usable inside the function.')
    }

    a();

    try {
        x();    // Error
    } catch (e) {
        assert.ok(true, 'x() is undefined outside the functions.')
    }
});

QUnit.test('Function Scope', (assert) =>{
    var testDeclaration = false,
        foo;

    // This function gets erroneously overridden in IE8
    function bar(arg1, bleed) {
        if (bleed) {
            assert.ok(false, 'Declaration bar() should NOT be called from inside the expression');
        } else {
            assert.ok(true, 'Declaration bar() should be called outside the expression');
        }
        testDeclaration = true;
    }

    foo = function bar (declaration, recurse) {
        if (recurse) {
            assert.ok(true, 'Expression bar() should support scope safe recursion');
        } else if (declaration == true) {
            assert.ok(true, 'Expression bar() should be callable via foo()');
            bar(false, true);
        } else {
            // Fails in IE8 and older
            assert.ok(false, 'Expression bar() should NOT be callable outside the expression');
        }
    };

    bar();
    foo(true);

    // Fails in IE8
    assert.ok(testDeclaration, 'The bar() declaration should NOT get overridden by the expression bar()');
});

// IIFE
var Lightbulb = function () {
        this.isOn = false;
    },
    lightbulb = new Lightbulb();

Lightbulb.prototype.toggle = function () {
    this.isOn = !this.isOn;
    return this.isOn;
};

Lightbulb.prototype.getState = function getState () {
    // Implementation
};

Lightbulb.prototype.off = function off () {
    this.isOn = false;
    return this.isOn;
};

Lightbulb.prototype.on = function on () {
    this.isOn = true;
    return this.isOn;
}

Lightbulb.blink = function blink () {
    setInterval(function () {

    }, 1000);
};

QUnit.test('Prototypes without IIFE', (assert) => {
    assert.equal(lightbulb.toggle(), true, 'Lightbulb turns on');
    assert.equal(lightbulb.toggle(), false, 'Lightbulb turns off');
});

(function () {
    var isOn = false,
        toggle = function toggle () {
            isOn = !isOn;
            return isOn;
        },
        getState = function getState () {

        },
        off = function off () {
            this.isOn = false;
            return this.isOn;
        },
        on = function on () {
            this.isOn = true;
            return this.isOn;
        },
        blink = function blink () {

        },

        lightbulb = {
            toggle: toggle,
            getState: getState,
            off: off,
            on: on,
            blink: blink
        };

    QUnit.test('Prototypes with IIFE', (assert) => {
        assert.equal(lightbulb.toggle(), true, 'Lightbulb turns on.');
        assert.equal(lightbulb.toggle(), false, 'Lightbulb turns off.');
    });
}());

// Method Context
function highPass(number, cutoff) {
    cutoff = cutoff || this.cutoff;
    return (number >= cutoff);
}

var filter1 = {
        highPass: highPass,
        cutoff: 5
    },
    filter2 = {
        // No highPass here
        cutoff: 3
    }

QUnit.test('Invoking a function', (assert) => {
    var result = highPass(6, 5);
    assert.equal(result, true, '6 > 5 should be true');
});

QUnit.test('Invoking a method.', function (assert) {
    var result1 = filter1.highPass(3),
        result2 = highPass.call(filter2, 3),
        result3 = filter1.highPass(6);

    assert.equal(result1, false, '3 >= filter1.cutoff should be false');
    assert.equal(result2, true, '3 >= filter2.cutoff should be true');
    assert.equal(result3, true, '6 >= filter1.cutoff should be true');
});
