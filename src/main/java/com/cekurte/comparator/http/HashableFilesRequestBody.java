package com.cekurte.comparator.http;

import java.util.Collection;
import java.util.Map;

import com.cekurte.comparator.file.JsonMapper;

public class HashableFilesRequestBody {
    private Map<String, Collection<JsonMapper>> duplicatedFiles;

    public Map<String, Collection<JsonMapper>> getDuplicatedFiles() {
        return duplicatedFiles;
    }

    public void setDuplicatedFiles(Map<String, Collection<JsonMapper>> duplicatedFiles) {
        this.duplicatedFiles = duplicatedFiles;
    }
}
