<?php
include('Upload.php');

class FaceMatch {

    function decodeHtmlEntity($datas)
    {
        $datas = json_decode($datas, true);
        foreach($datas['result'] as $k => &$v){
            $v['people_name'] = html_entity_decode($v['people_name'], ENT_QUOTES);
        }
        //var_dump($datas);exit;
        return $datas;
    }

    function postData($url, $data)
    {
        $ch      = curl_init();
        $timeout = 300;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_REFERER, "");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $data = curl_exec($ch);
        if(!$data){
            var_dump(curl_error($ch));
        }
        curl_close($ch);
        return $data;
    }

    function getSimilarStar($img_url)
    {
        $url = "http://www.eyekey.com/eyekey/apply/face_match_many";
        $data = array(
                //'url' => $_POST['url'],
                //'url' => "https://imgsa.baidu.com/baike/s%3D500/sign=89fc6048d0ca7bcb797bc72f8e0b6b3f/96dda144ad3459824945bc190bf431adcaef846a.jpg",
                'url' => $img_url,
                'canvas_type' => 1,
                );
        $datas = self::postData($url, $data);
        $datas = self::decodeHtmlEntity($datas);
        $datas = json_encode($datas, JSON_UNESCAPED_UNICODE);
        echo $datas;       
    }

}

$obj_upload = new Upload();
$destination_folder = "upload/"; //上传文件路径
$input_file_name    = "upfile";
$maxwidth           = 640;
$maxheight          = 1136;
$upload_result      = $obj_upload->uploadImg($destination_folder, $input_file_name, $maxwidth, $maxheight); //调用上传函数
if($upload_result === false){
    echo "upload failed";
    exit;
}

$img_url = "https://www.classmateer.com/WhatsStar/upload/" . $upload_result;
$obj_face_match = new FaceMatch();
$obj_face_match->getSimilarStar($img_url);


