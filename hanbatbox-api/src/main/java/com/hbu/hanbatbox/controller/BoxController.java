package com.hbu.hanbatbox.controller;

import com.hbu.hanbatbox.dto.BoxGetDto;
import com.hbu.hanbatbox.dto.BoxSaveDto;
import com.hbu.hanbatbox.dto.Result;
import com.hbu.hanbatbox.service.BoxService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/boxes")
public class BoxController {

    private final BoxService boxService;

    @GetMapping
    public ResponseEntity<Result<List<BoxGetDto>>> getAllBoxes(
        @RequestParam(required = false) Long cursor, @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String type) {

        List<BoxGetDto> boxes = boxService.searchBoxes(keyword, type, cursor);
        return ResponseEntity.ok(new Result<>(200, "Success", boxes));
    }

    @PostMapping(value = "/uploads", consumes = {MediaType.APPLICATION_JSON_VALUE,
        MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Long> uploads(@RequestPart BoxSaveDto data,
        @RequestPart List<MultipartFile> files) {

        Long boxId = boxService.saveBoxWithItems(data, files);

        return ResponseEntity.ok(boxId);
    }
}