export interface Serializable<T> {
    serialize: () => SerializeValue;
    deserialize: (s: T) => boolean;
}

export interface KeySerializable<T> {
    key: string;
    serializable: Serializable<T>
}

export interface SerializeValue {
    [name: string]: object|string|number
}

export interface Serialized<T> {
    path: string;
    key: string;
}

export interface SerializedValue<T> {
    [key: string]: T
}

export interface StandardSerializeable extends Serializable<SerializeValue> {}
