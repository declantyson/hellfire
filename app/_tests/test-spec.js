describe('Global', function() {
    var world;
    beforeEach(function () {
        world = 'Hello';
    });

    it("should be greeting you", function(){
        expect(world).toEqual('Hello');
    });
});