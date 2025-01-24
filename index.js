import * as crypto from 'crypto';
import * as secp256k1 from 'secp256k1';
import * as keccak from 'keccak';

class EthereumKeyGenerator {

  static generatePrivateKey() {
    let privateKey;
    do {
      // Generate 32 random bytes
      privateKey = crypto.randomBytes(32);
      
      // Validate key meets secp256k1 curve constraints
    } while (!secp256k1.privateKeyVerify(privateKey));

    return '0x' + privateKey.toString('hex');
  }

  
  static getPublicKey(privateKey) {
    const privateKeyBuffer = Buffer.from(privateKey.replace('0x', ''), 'hex');
    const publicKey = secp256k1.publicKeyCreate(privateKeyBuffer);
    return '0x' + Buffer.from(publicKey).toString('hex');
  }

  
  static getEthereumAddress(publicKey) {
    // Remove '0x' and first byte (public key prefix)
    const publicKeyNoPrefix = publicKey.slice(4);
    
    // Keccak-256 hash
    const addressHash = keccak('keccak256')
      .update(Buffer.from(publicKeyNoPrefix, 'hex'))
      .digest('hex');
    
    // Last 20 bytes (40 hex characters)
    return '0x' + addressHash.slice(-40);
  }

  static generateFullKey() {
    const privateKey = this.generatePrivateKey();
    const publicKey = this.getPublicKey(privateKey);
    const address = this.getEthereumAddress(publicKey);

    return {
      privateKey,
      publicKey,
      address
    };
  }
}

export default EthereumKeyGenerator;

// Example usage
const keySet = EthereumKeyGenerator.generateFullKey();
console.log(keySet);