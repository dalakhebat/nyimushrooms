<?php

namespace App\Traits;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

trait EncryptsSensitiveData
{
    /**
     * Get the encrypted fields for this model.
     * Override this in your model to specify which fields should be encrypted.
     */
    protected function getEncryptedFields(): array
    {
        return $this->encryptedFields ?? [];
    }

    /**
     * Encrypt a value if it's not already encrypted.
     */
    protected function encryptValue($value)
    {
        if (is_null($value) || $value === '') {
            return $value;
        }

        // Check if already encrypted (starts with eyJ which is base64 encoded JSON)
        if (is_string($value) && str_starts_with($value, 'eyJ')) {
            return $value;
        }

        return Crypt::encryptString((string) $value);
    }

    /**
     * Decrypt a value safely.
     */
    protected function decryptValue($value)
    {
        if (is_null($value) || $value === '') {
            return $value;
        }

        // If it's not a string or doesn't look encrypted, return as-is
        if (!is_string($value) || !str_starts_with($value, 'eyJ')) {
            return $value;
        }

        try {
            return Crypt::decryptString($value);
        } catch (DecryptException $e) {
            // If decryption fails, return the original value
            // This handles cases where data was stored before encryption was added
            return $value;
        }
    }

    /**
     * Override setAttribute to encrypt sensitive fields.
     */
    public function setAttribute($key, $value)
    {
        if (in_array($key, $this->getEncryptedFields())) {
            $value = $this->encryptValue($value);
        }

        return parent::setAttribute($key, $value);
    }

    /**
     * Override getAttribute to decrypt sensitive fields.
     */
    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);

        if (in_array($key, $this->getEncryptedFields())) {
            $value = $this->decryptValue($value);
        }

        return $value;
    }

    /**
     * Override toArray to decrypt sensitive fields in arrays.
     */
    public function toArray()
    {
        $array = parent::toArray();

        foreach ($this->getEncryptedFields() as $field) {
            if (isset($array[$field])) {
                $array[$field] = $this->decryptValue($array[$field]);
            }
        }

        return $array;
    }

    /**
     * Get raw (encrypted) value for a field.
     */
    public function getRawEncrypted($key)
    {
        return parent::getAttribute($key);
    }
}
