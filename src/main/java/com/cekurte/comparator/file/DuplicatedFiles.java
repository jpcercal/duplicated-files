package com.cekurte.comparator.file;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

public class DuplicatedFiles implements Runnable {
    private Map<String, Collection<ComparableFile>> map;

    private Map<String, Collection<ComparableFile>> duplicatedFiles;

    public DuplicatedFiles(Map<String, Collection<ComparableFile>> map) {
        this.map = map;

        this.duplicatedFiles = new HashMap<>();
    }

    @Override
    public void run() {
        this.searchForDuplicatedFiles();
    }

    public Map<String, Collection<ComparableFile>> getMap() {
        return this.map;
    }

    public Map<String, Collection<ComparableFile>> getDuplicatedFiles() {
        return this.duplicatedFiles;
    }

    private void searchForDuplicatedFiles() {
        FileComparator comparator = new FileComparator();

        List<String> paths = new ArrayList<>();

        System.out.println("Scanning the paths:");

        for (String path : map.keySet()) {
            System.out.println(String.format("> %s", path));

            paths.add(path);
        }

        for (int currentIndex = 0; currentIndex < paths.size(); currentIndex++) {

            Collection<ComparableFile> leftFiles = map.get(paths.get(currentIndex));

            for (int i = 0; i < paths.size(); i++) {
                if (currentIndex == i) {
                    continue;
                }

                for (ComparableFile left : leftFiles) {
                    for (ComparableFile right : map.get(paths.get(i))) {

                        System.out.println(String.format(
                            "\n> Comparing the file \"%s\" with the file \"%s\".",
                            left.getAbsolutePath(),
                            right.getAbsolutePath()
                        ));

                        if (comparator.equals(left, right)) {
                            System.out.println(String.format(
                                "[+] A duplicated file was found. The md5 hash file is \"%s\".",
                                left.getMd5()
                            ));

                            Collection<ComparableFile> data;

                            if (!this.duplicatedFiles.containsKey(left.getMd5())) {
                                data = new HashSet<>();
                            } else {
                                data = this.duplicatedFiles.get(left.getMd5());
                            }

                            data.add(left);
                            data.add(right);

                            this.duplicatedFiles.put(left.getMd5(), data);
                        }
                    }
                }
            }
        }
    }
}
