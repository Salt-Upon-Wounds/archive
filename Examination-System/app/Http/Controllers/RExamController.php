<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

function simple_question1() {
    $res = array('type' => 'select the answer',
    'text' => '',
    'answer' => '',
    'states' => array());
    $a = random_int(1, 100);
    $b = random_int(1, 100);
    $res['text'] = "$a * $b = ?";
    $res['states'][] = $a * $b;
    $res['states'][] = random_int(1, 100) * random_int(1, 100);
    $res['states'][] = random_int(1, 100) * random_int(1, 100);
    $res['states'][] = random_int(1, 100) * random_int(1, 100);
    $res['states'][] = random_int(1, 100) * random_int(1, 100);
    shuffle($res['states']);
    $res['answer'] = array_search($a * $b, $res['states']);
    return $res;
}

function simple_question2() {
    $res = array('type' => 'select the answer',
    'text' => '',
    'answer' => '',
    'states' => array());
    $a = random_int(1, 100);
    $b = random_int(1, 100);
    $res['text'] = "$a + $b = ?";
    $res['states'][] = $a + $b;
    $res['states'][] = random_int(1, 100) + random_int(1, 100);
    $res['states'][] = random_int(1, 100) + random_int(1, 100);
    $res['states'][] = random_int(1, 100) + random_int(1, 100);
    $res['states'][] = random_int(1, 100) + random_int(1, 100);
    shuffle($res['states']);
    $res['answer'] = array_search($a + $b, $res['states']);
    return $res;
}

function t1n5() {
    $arr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    shuffle($arr);
    $a = $arr[0] * $arr[1] * $arr[2];
    $b = $arr[0] * $arr[1] * $arr[3];
    $c = $arr[0] * $arr[1] * $arr[5] * $arr[4];
    $res = array('type' => 'select the answer',
    'text' => "Для группы туристов был закуплен сухой паек, в который
    вошли $a банок тушенки, $b плиток шоколада
    и $c пакетика чая. Определите наибольшее возможное
    количество туристов в группе, если все продукты были
    распределены между ними поровну.",
    'answer' => '',
    'states' => array());
    $res['states'][] = $arr[0];
    $res['states'][] = $arr[0] * $arr[1];
    $res['states'][] = $arr[0] * $arr[2];
    $res['states'][] = $arr[1] * $arr[3];
    $res['states'][] = $arr[1] * $arr[2];
    shuffle($res['states']);
    $res['answer'] = array_search($arr[0] * $arr[1], $res['states']);
    return $res;
}

function t1n50() {
    $a = 9 * random_int(3, 11);
    $b = 5 * random_int(1, 10);
    $res = array('type' => 'select the answer',
    'text' => "Автомобиль движется со скоростью $a км/ч. Если
    автомобиль увеличит скорость на $b %, то она станет
    равной (в м/с):",
    'answer' => '',
    'states' => array());
    $res['states'][] = $a * ($b + 100) / 360;
    $res['states'][] = $a * (100 - $b) / 360;
    $res['states'][] = $a * $b / 360;
    $res['states'][] = $a * (100 - $b) / 100;
    $res['states'][] = $a * (100 + $b) / 100;
    shuffle($res['states']);
    $res['answer'] = array_search($a * ($b + 100) / 360, $res['states']);
    return $res;
}

function t1n133() {
    $a = [2,3,7];
    $b = [19,23,29,31,37,41,43,53];
    $c = [3,4];
    shuffle($a);
    shuffle($b);
    shuffle($c);
    $d = pow($a[0], $c[0]) * $b[0];
    $ans = $a[0] + $b[0];
    $res = array('type' => 'fill the blank',
    'text' => "Натуральные числа a и b, большие 1, являются взаимно простыми. Найдите
    сумму чисел a и b, если их произведение равно $d. {{{}}}",
    'answer' => array("$ans"));
    return $res;
}

function t1n110() {
    $a = random_int(2, 9);
    $b = random_int(2, 9);
    $c = random_int(2, 9);
    $d = random_int(2, 9);
    $p1 = $a * M_PI / $b;
    $p2 = $c * M_PI / $d;
    $ans = abs(ceil($p1-$p2));
    $res = array('type' => 'select the answer',
    'text' => "Сколько точек с целыми координатами расположено на координатной прямой между
    точками С($a * Pi / $b) и А($c * Pi / $d):",
    'answer' => '',
    'states' => array());
    $res['states'][] = $ans - 2;
    $res['states'][] = $ans -1 ;
    $res['states'][] = $ans;
    $res['states'][] = $ans + 1;
    $res['states'][] = $ans + 2;
    shuffle($res['states']);
    $res['answer'] = array_search($ans, $res['states']);
    return $res;
}

function dummy1() {
    $a = random_int(2, 9);
    $b = random_int(2, 9);
    $c = random_int(2, 9);
    $d = random_int(2, 9);
    $p1 = $a * M_PI / $b;
    $p2 = $c * M_PI / $d;
    $ans = abs(ceil($p1-$p2));
    $res = array('type' => 'select the answer',
    'text' => "Сколько точек с целыми координатами расположено на координатной прямой между
    точками С($a * Pi / $b) и А($c * Pi / $d):",
    'answer' => '',
    'states' => array());
    $res['states'][] = $ans - 2;
    $res['states'][] = $ans -1 ;
    $res['states'][] = $ans;
    $res['states'][] = $ans + 1;
    $res['states'][] = $ans + 2;
    shuffle($res['states']);
    $res['answer'] = array_search($ans, $res['states']);
    return $res;
}

function dummy2() {
    $a = random_int(50,100);
    $b = random_int(3,7);
    $ans = 'ans';
    $res = array('type' => 'fill the blank',
    'text' => "Автомобиль двигается со скоростью $a км/ч. Сколько километров он проедет за $b ч?. {{{}}}",
    'answer' => $ans);
    return $res;
}
function dummy3() {
    $a = random_int(2,11);
    $b = random_int(2,11);
    if ($a < $b) {
        $tmp = $a;
        $a = $b;
        $b = $a;
    }
    $ans = 'ans';
    $res = array('type' => 'fill the blank',
    'text' => "найдите сумму первых ста натуральных чисел, которые при делении на $a  дают остаток $b. {{{}}}",
    'answer' => $ans);
    return $res;
}
function dummy4() {
    $a = random_int(100,200);
    $b = [3,5,7];
    shuffle($b);
    $c = $b[0] * random_int(2,5);
    $ans = 'ans';
    $res = array('type' => 'fill the blank',
    'text' => "За какое время при движении против течения реки
    теплоход пройдет $a км, если его собственная скорость
    $c км/ч, а скорость течения в $b[0] раз меньше собственной
    скорости теплохода? {{{}}}",
    'answer' => $ans);
    return $res;
}

class RExamController extends Controller
{

    function generate() {
        $arr = [
            (object) t1n133(),
            (object) t1n50(),
            (object) t1n5(),
            (object) t1n110(),
            (object) dummy2(),
            (object) dummy3(),
            (object) dummy4(),
            (object) simple_question1(),
            (object) simple_question2(),
        ];
        shuffle($arr);

        return response()->json($arr, 200);
    }
}
