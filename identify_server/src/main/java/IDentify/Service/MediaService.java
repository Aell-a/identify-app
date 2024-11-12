package IDentify.Service;

import IDentify.Entity.Media;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class MediaService {

    private final Path rootLocation = Paths.get("uploads");

    public Media uploadMedia(MultipartFile file, Long userId) throws IOException {
        Path userDirectory = this.rootLocation.resolve(String.valueOf(userId));

        Files.createDirectories(userDirectory);

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destinationFile = userDirectory.resolve(filename);
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

        Media media = new Media();
        media.setMediaUrl(destinationFile.toString());
        media.setMediaType(Objects.requireNonNull(file.getContentType()));
        media.setMediaFormat(Objects.requireNonNull(FilenameUtils.getExtension(file.getOriginalFilename())));
        return media;
    }
}
