/**
 * Module dependencies
 */
var debug = require('simple-debug')('consulate-authcode-simple-secrets-redis')
  , redis = require('redis')
  , redisurl = require('redisurl');

/**
 * Defines
 */

var TEN_MINUTES_S = 10 * 60 * 60
  , PREFIX = 'authcode';

/**
 * Expose AuthcodeRedis
 */

module.exports = AuthcodeRedis;

/**
 * Create an AuthcodeRedis connection
 *
 * @param {Object} options
 * @api public
 */

function AuthcodeRedis (options) {
  if (!(this instanceof AuthcodeRedis)) return new AuthcodeRedis(options);

  // Defaults
  options = options || {};

  this.conn = redisurl(options.url);
  this.ttl = options.ttl || TEN_MINUTES_S;
  this.prefix = options.prefix || PREFIX;
  debug('using options', {ttl: this.ttl, prefix: this.prefix});
};

/**
 * Save an auth code
 *
 * @param {String} code
 * @param {Function} cb
 * @return {AuthcodeRedis}
 * @api public
 */

AuthcodeRedis.prototype.save = function(code, cb) {
  var key = this._key(code);
  this.conn.multi()
    .set(key, '')
    .expire(key, this.ttl)
    .exec(function(err) {
      debug('event=save_code key="%s" err="%s"', key, err);
      cb(err);
    });
  return this;
};

/**
 * Validate an auth code
 *
 * @param {String} code
 * @param {Function} cb
 * @return {AuthcodeRedis}
 * @api public
 */

AuthcodeRedis.prototype.validate = function(code, cb) {
  var key = this._key(code);
  this.conn.exists(key, function(err, isValid) {
    debug('event=validate_code key="%s" error="%s" valid=%d', key, err, isValid);
    cb(err, !!isValid);
  });
  return this;
};

/**
 * Invalidate an auth code
 *
 * @param {String} code
 * @param {Function} cb
 * @return {AuthcodeRedis}
 * @api public
 */

AuthcodeRedis.prototype.invalidate = function(code, cb) {
  var key = this._key(code);
  this.conn.del(key, function(err) {
    debug('event=invalidate_code key="%s" error="%s"', key, err);
    cb(err);
  });
  return this;
};

/**
 * Create a redis key from a code
 *
 * @param {String} code
 * @return {String}
 * @api private
 */

AuthcodeRedis.prototype._key = function(code) {
  return [this.prefix, code].join(':');
};
