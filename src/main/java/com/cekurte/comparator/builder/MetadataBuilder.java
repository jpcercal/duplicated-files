package com.cekurte.comparator.builder;

import java.util.HashMap;
import java.util.Map;

public class MetadataBuilder {
    private Map<String, String> metadata;

    public MetadataBuilder() {
        metadata = new HashMap<>();
    }

    public MetadataBuilder addMeta(String key, String value)
    {
        metadata.put(key, value);

        return this;
    }

    public Map<String, String> getMetadata()
    {
        return metadata;
    }
}
