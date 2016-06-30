package com.cekurte.comparator.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.cekurte.comparator.file.ComparableFile;
import com.cekurte.comparator.file.DirectoryIterator;
import com.cekurte.comparator.file.DuplicatedFiles;
import com.cekurte.comparator.file.FileComparator;
import com.cekurte.comparator.file.JsonMapper;
import com.cekurte.comparator.http.DirectoryRequestBody;
import com.cekurte.comparator.http.HashableFilesRequestBody;
import com.sun.jna.platform.FileUtils;

@RestController
@RequestMapping("/api")
public class PictureComparatorController {

    @RequestMapping(value="/remove-files", method=RequestMethod.DELETE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void removeDuplicadedPictures(@RequestBody HashableFilesRequestBody request)
    {
        System.out.println("Removing duplicated files...");

        FileUtils fileUtils = FileUtils.getInstance();

        for (String key : request.getDuplicatedFiles().keySet()) {
            Collection<JsonMapper> col = request.getDuplicatedFiles().get(key);
            for (JsonMapper mapper : col) {
                if (fileUtils.hasTrash()) {
                    try {
                        fileUtils.moveToTrash(new File[] {
                            new File(mapper.getAbsoluteFile())
                        });
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                } else {
                    System.out.println("No Trash available.");
                }
            }
        }
    }

    @RequestMapping(value="/duplicated-files", method=RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Collection<ComparableFile>> searchForDuplicadedPictures(@RequestBody DirectoryRequestBody request)
    {
        Collection<String> paths = request.getDirectories();

        Collection<Thread> threadCollection = new ArrayList<>();

        Map<String, DirectoryIterator> runnableMap = new HashMap<>();

        for (String path : paths) {
            DirectoryIterator runnable = new DirectoryIterator(path);

            Thread thread = new Thread(runnable);

            thread.start();

            threadCollection.add(thread);
            runnableMap.put(path, runnable);
        }

        Map<String, Collection<ComparableFile>> map = new HashMap<>();

        try {
            for (Thread thread : threadCollection) {
                thread.join();
            }

            for (String path : paths) {
                map.put(path, runnableMap.get(path).getFiles());
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        DuplicatedFiles runnable = new DuplicatedFiles(map);
        Thread threadDuplicated = new Thread(runnable);

        threadDuplicated.start();

        try {
            threadDuplicated.join();

            return runnable.getDuplicatedFiles();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
