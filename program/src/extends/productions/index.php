<?php
	// Get the list of graduations.
	$dir     = './';
	$folders = array_merge(array_diff(scandir($dir), array('.', '..')));

	// HTML header.
	echo
		'<!DOCTYPE html>' .
		'<html>' .
			'<head>' .
				'<meta charset="UTF-8">' .
				'<title>Graphics Animation Multimedia Edutainment Lab @ NTUST</title>' .
				'<link rel="stylesheet" href="../public/reset.css">' .
				'<link rel="stylesheet" href="../public/style.css">' .
				'<link rel="stylesheet" href="../public/font-awesome-4.6.0/css/font-awesome.min.css">' .
				'<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Armata">' .
				'<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Pontano+Sans">' .
				'<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,300">' .
			'</head>' .
			'<body>' .
				'<div class="main-content" style="padding-bottom: 100px;">' .
					'<h2 class="title unselectable" style="font-family: Times, serif;">' .
						'<span">Graduation documents</span>' .
					'</h2>' .
					'<div class="graduations">';

	// Elements of HTML.
	foreach ($folders as $folder) {
		// Using RegExp to parse the folder name.
		preg_match('/(\w+)_(\w+)_(.+)/', $folder, $matches, PREG_OFFSET_CAPTURE);
		// If not allow the pattern, skip it.
		if (! count($matches)) { break; }

		// Normalize the paramaters.
		$id   = $matches[1][0];
		$date = $matches[2][0];
		$name = $matches[3][0];

		$videoPath    = array_merge(glob('./' . $folder . '/video.*'), glob('./' . $folder . '/video'));
		$documentPath = array_merge(glob('./' . $folder . '/document.*'), glob('./' . $folder . '/document'));
		$posterPath   = array_merge(glob('./' . $folder . '/poster.*'), glob('./' . $folder . '/poster'));

		echo
			'<div class="graduation">' .
				'<div class="header">' .
					'<span class="title">' . $id . '</span>' .
				'</div>' .
				'<div class="content">' .
					'<p class="name forceFont">' . $name . '</p>' .
					'<ul class="files">';

		if (count($videoPath)) echo
						'<li class="video"><a target="_blank" href="' . $videoPath . '">Video</a></li> / ';
		else echo
						'<li class="video">Video</li> / ';

		if (count($documentPath)) echo
						'<li class="document"><a target="_blank" href="' . $documentPath . '">Document</a></li> / ';
		else echo
						'<li class="document">Document</li> / ';

		if (count($posterPath)) echo
						'<li class="poster"><a target="_blank" href="' . $posterPath . '">Poster</a></li>';
		else echo
						'<li class="poster">Poster</li>';

		echo
					'</ul>' .
					'<p class="id forceFont">' . $date . ' leaved</p>' .
				'</div>' .
			'</div>';
	}

	// Footer of HTML.
	echo '</div></div><footer style="position: fixed; bottom: 0; width: 100%;"><div class="copyright">Graphics Animation Multimedia Edutainment Laboratory</div><div class="designer">Designed by Ze-Hao Wang (salmon.tw)</div></footer></body></html>';
?>