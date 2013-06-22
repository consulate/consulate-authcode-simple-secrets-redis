/**
 * Module dependencies
 */
var should = require('should')
  , redis = require('..');


describe('consulate-authcode-simple-secrets-redis', function() {

  var db;

  beforeEach(function() {
    db = redis({ttl: 1});
  });

  it('should save/validate/invalidate a code', function(done) {
    var key = 'test';

    db.save(key, function(err) {
      if (err) return done(err);

      db.validate(key, function(err, isValid) {
        if (err) return done(err);
        isValid.should.be.ok;

        db.invalidate(key, function(err) {
          if (err) return done(err);

          db.validate(key, function(err, isValid) {
            if (err) return done(err);
            isValid.should.not.be.ok;
            done();
          });
        });
      });
    });
  });

  it('should expire a code', function(done) {
    var key = 'test2';

    db.save(key, function(err) {
      if (err) return done(err);

      setTimeout(function() {
        db.validate(key, function(err, isValid) {
          if (err) return done(err);
          if (isValid) return done(new Error(key+' was not invalidated with ttl'));
          done();
        });
      }, 1500);
    });
  });
});
