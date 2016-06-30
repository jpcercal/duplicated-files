package com.cekurte.comparator.file;

import com.cekurte.comparator.contract.Comparator;
import com.cekurte.comparator.contract.HashFile;

public class FileComparator implements Comparator {

    @Override
    public boolean equals(HashFile left, HashFile right) {
        if (left.getMd5().equals(right.getMd5())) {
            return true;
        }

        return false;
    }
}
