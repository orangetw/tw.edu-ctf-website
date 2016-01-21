
/* includes for encflag
<script src="js/vendor/pidcrypt/pidcrypt_c.js"></script>
<script src="js/vendor/pidcrypt/pidcrypt_util_c.js"></script>
<script src="js/vendor/pidcrypt/sha256_c.js"></script>
<script src="js/vendor/pidcrypt/jsbn_c.js"></script>
<script src="js/vendor/pidcrypt/rng_c.js"></script>
<script src="js/vendor/pidcrypt/prng4_c.js"></script>
<script src="js/vendor/pidcrypt/asn1_c.js"></script>
<script src="js/vendor/pidcrypt/rsa_c.js"></script>
*/
encflag_rsa = function(team_id, plain_flag, key){
  //team_id should be a string.
  //plain_flag should be a string.
  //key should be a string, base64 encoded public key of RSA.
  //return a base64 encrypted string.
  //
  var plain_text = {};
  plain_text.team_id = team_id;
  plain_text.flag_sha256 = pidCrypt.SHA256(plain_flag);
  plain_text = JSON.stringify(plain_text);
  var pub_key = pidCryptUtil.decodeBase64(key)
  var rsa = new pidCrypt.RSA();
  var asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(pub_key));
  var tree = asn.toHexTree();
  rsa.setPublicKeyFromASN(tree);
  var crypted = pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(rsa.encrypt(plain_text)));
  return crypted;
}

encflag = function(team_id, plain_flag){
  //team_id should be a string.
  //plain_flag should be a string.
  //return a base64 encoded string.
  //
  var plain_text = {};
  plain_text.team_id = team_id;
  plain_text.flag_sha256 = pidCrypt.SHA256(plain_flag);
  plain_text = JSON.stringify(plain_text);
  var crypted = pidCryptUtil.encodeBase64(plain_text);
  return crypted;
}

