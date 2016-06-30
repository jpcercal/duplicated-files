package com.cekurte.comparator.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLConnection;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;

import com.cekurte.comparator.builder.MetadataBuilder;
import com.cekurte.comparator.contract.HashFile;
import com.cekurte.comparator.contract.Metadata;
import com.cekurte.comparator.contract.PictureMetadata;
import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Tag;
import com.drew.metadata.file.FileMetadataDirectory;
import com.drew.metadata.gif.GifHeaderDirectory;
import com.drew.metadata.jpeg.JpegDirectory;
import com.drew.metadata.png.PngDirectory;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "path",
    "name",
    "parent",
    "absolute",
    "absoluteFile",
    "absolutePath",
    "directory",
    "file",
    "hidden",
    "metadata"
})

@JsonIgnoreProperties({
    "md5",
    "canonicalPath",
    "canonicalFile",
    "freeSpace",
    "parentFile",
    "totalSpace",
    "usableSpace"
})
public class ComparableFile extends File implements HashFile {
    private MetadataBuilder builder;

    public ComparableFile(File file) {
        super(file.getAbsolutePath());

        generateMetadata();
    }

    private void generateMetadata()
    {
        builder = new MetadataBuilder();

        builder.addMeta(Metadata.MIMETYPE, URLConnection.getFileNameMap().getContentTypeFor(getName()));

        try {
            FileInputStream fis = new FileInputStream(this);

            builder.addMeta(Metadata.MD5, DigestUtils.md5Hex(fis));

            fis.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        try {
            com.drew.metadata.Metadata meta = ImageMetadataReader.readMetadata(this);

            for (Directory directory : meta.getDirectories()) {
                if (directory instanceof JpegDirectory) {
                    builder.addMeta(Metadata.TYPE, "jpg");
                }

                if (directory instanceof PngDirectory) {
                    builder.addMeta(Metadata.TYPE, "png");
                }

                if (directory instanceof GifHeaderDirectory) {
                    builder.addMeta(Metadata.TYPE, "gif");
                }

                System.out.println(directory.getName());

                for (Tag tag : directory.getTags()) {
                    System.out.println(tag);

                    String height = null;
                    String width  = null;

                    if (directory instanceof JpegDirectory) {
                        height = directory.getTagName(JpegDirectory.TAG_IMAGE_HEIGHT);
                        width  = directory.getTagName(JpegDirectory.TAG_IMAGE_WIDTH);
                    }

                    if (directory instanceof PngDirectory) {
                        height = directory.getTagName(PngDirectory.TAG_IMAGE_HEIGHT);
                        width  = directory.getTagName(PngDirectory.TAG_IMAGE_WIDTH);
                    }

                    if (directory instanceof GifHeaderDirectory) {
                        height = directory.getTagName(GifHeaderDirectory.TAG_IMAGE_HEIGHT);
                        width  = directory.getTagName(GifHeaderDirectory.TAG_IMAGE_WIDTH);
                    }

                    if (directory instanceof FileMetadataDirectory) {
                        if (tag.getTagName().equals(directory.getTagName(FileMetadataDirectory.TAG_FILE_SIZE))) {
                            Double size = Double.parseDouble(tag.getDescription().replace(" bytes", "")) / 1024;
                            NumberFormat nf = DecimalFormat.getInstance(Locale.ENGLISH);
                            nf.setMaximumFractionDigits(2);
                            nf.setMinimumFractionDigits(2);
                            builder.addMeta(Metadata.SIZE, nf.format(size) + " KB");
                        }
                    }

                    if (tag.getTagName().equals(height)) {
                        builder.addMeta(PictureMetadata.HEIGHT, tag.getDescription().replace(" pixels", "px"));
                    }

                    if (tag.getTagName().equals(width)) {
                        builder.addMeta(PictureMetadata.WIDTH, tag.getDescription().replace(" pixels", "px"));
                    }
                }
            }
        } catch (ImageProcessingException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String getMd5()
    {
        return builder.getMetadata().get(Metadata.MD5);
    }

    public Map<String, String> getMetadata()
    {
        return builder.getMetadata();
    }
}
