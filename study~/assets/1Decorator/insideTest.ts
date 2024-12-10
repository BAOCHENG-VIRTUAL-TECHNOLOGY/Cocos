import { _decorator, Component, Node,Color,RealCurve,CurveRange ,Gradient,GradientRange} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('insideTest')
export class insideTest extends Component {
    // @property(Color)
    // color:Color;
    // @property(RealCurve)
    // realCurve:RealCurve = new RealCurve();
    // @property(CurveRange)
    // curveRange:CurveRange=new CurveRange();
    // @property(Gradient)
    // gradient = new Gradient();
    @property(GradientRange)
    gradientRange:GradientRange=new GradientRange();
}


