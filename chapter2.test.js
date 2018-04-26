QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});


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
        // cart.items = items;
        // Fixed
        cart.items = Object.create(items);
        return cart;
    },
    // Load cart with stored items
    saveCart = createCart(['apple', 'pear', 'orange']),

    session = {
        get: function get () {
            return this.cart;
        },

        // Grab the saved cart.
        cart: createCart(saveCart.items)
    };

    // addItems gets triggered by an event handler somewhere
    session.cart.addItem('grapefruit');

    assert.ok(session.cart.items.indexOf('grapefruit') !== -1, 'Passes: Session cart has grapefruit');
});