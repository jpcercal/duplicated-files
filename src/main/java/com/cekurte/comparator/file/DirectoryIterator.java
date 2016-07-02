package com.cekurte.comparator.file;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;

public class DirectoryIterator implements Runnable {
    private String path;

    private Collection<ComparableFile> files;

    public DirectoryIterator(String path) {
        this.path  = path;
        this.files = new ArrayList<>();
    }

    @Override
    public void run() {
        this.getFilesRecursively();
    }

    public String getPath() {
        return this.path;
    }

    public Collection<ComparableFile> getFiles() {
        return this.files;
    }

    private void getFilesRecursively() {
        File path = new File(this.path);

        if (path.isDirectory()) {
           for (File file : path.listFiles()) {
                if (file.isDirectory()) {
                    this.getFilesRecursively();
                } else if(file.isFile() && !file.isHidden()) {
                    ComparableFile comparableFile = new ComparableFile(file);

                    this.files.add(comparableFile);
                }
            }
        }
    }
}
