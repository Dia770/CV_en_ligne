<?php 
    
    $array = array("firstname" => "", "name" => "", "email" => "", "phone" => "", "message" => "", "firstnameError" => "", "nameError" => "", "emailError" => "", "phoneError" => "", "messageError" => "", "isSuccess" => false);
    
    $emailTo = "07amadoudiallo07@gmail.com";


    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        $array['firstname'] = verifyInput($_POST["firstname"]);
        $array['name'] = verifyInput($_POST["name"]);
        $array['email'] = verifyInput($_POST["email"]);
        $array['phone'] = verifyInput($_POST["phone"]);
        $array['message'] = verifyInput($_POST["message"]);
        $array['isSuccess'] = true;
        $emailText = "";
        
        
        if(empty($array['firstname'])) {
            $array['firstnameError'] = "Votre prénom ?";
            $array['isSuccess'] = false;
        } else { 
            { $emailText .= "Prenom: {$array['firstname']} \n"; }
        }
            
        if(empty($array['name'])) {
            $array['nameError'] = "Quelle est votre nom de famille ?";
            $array['isSuccess'] = false;
        } else { $emailText .= "Nom: {$array['name']} \n"; }
        
        if(isNotEmail($array['email'])) {
            $array['emailError'] = "Il faudra une addresse email correcte..." ;
            $array['isSuccess'] = false;
        } else { $emailText .= "Email: {$array['email']} \n"; }
        
        if(isNotPhone($array['phone'])) {
            $array['phoneError'] = "Il semble invalide ce numéro.";
            $array['isSuccess'] = false;
        } else { $emailText .= "Téléphone: {$array['phone']} \n"; }
        
        if(empty($array['message'])) {
            $array['messageError'] = "Quel est le message que vous voulez passez ?";
            $array['isSuccess'] = false;
        } else { $emailText .= "Message: {$array['message']} \n"; }
        
        if( $array['isSuccess']) {
            $headers = "From: {$array['firstname']} {$array['name']} <{$array['email']}>\r\nReply-To: {$array['email']}";
            mail($emailTo, "Tentative de contact", $emailText, $headers);
            $array['firstname'] = $array['name'] = $array['email'] = $array['phone'] = $array['message'] = "";
        } 
        
        echo json_encode($array);
        
    }

function verifyInput($var) {
    $input = trim($var);
    $input = stripslashes($var);
    $input = htmlspecialchars($var);
    return $var;
}

function isNotEmail($var) {
    return !(filter_var($var, FILTER_VALIDATE_DOMAIN));  // si vrai email retourne faux, sinon vrai.
}

function isNotPhone($var) {
    return !(preg_match("/^[0-9 +]*$/", $var));  // explique dans la video validation des données part2.
    // [0-9 +]* les CHIFFRES DE 0 à 9, les espaces, le caractere +, le * à la fin siginfie que le champ peut rester vide.
}
 


?>