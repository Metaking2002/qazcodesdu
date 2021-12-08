import React from 'react';
import './Another.css';
import Bounce from 'react-reveal/Bounce';
import ScrollTrigger from "react-scroll-trigger";
import data from '../data.json'
const container = {
	"01": {
		"info": "TECEDU (Техническое образование) предоставляет инновационные решения по обучению и развитию персонала нефтегазовых, горнодобывающих и энергетических компаний.",
		"img": "https://www.etopian.com/wp-content/uploads/icon_python.png",
		"count": "1",
		"gradient": "linear-gradient(135deg, #B0FFC2, #80BB75)"
	},
	"02": {
		"info": "Наш подход основан на значительном техническом опыте, культурном разнообразии и таланте преподавания наших инструкторов и консультантов.",
		"img" : "https://static1.squarespace.com/static/555b7fd5e4b0c7c58cfd6cf4/555cad58e4b0c3a1eda38033/5703d2d601dbae6afe70c2bd/1492701794101/c-img.png?format=1000w",
		"count": "1",
		"gradient": "linear-gradient(135deg, #C18AFC, #D6B3FC)"
	},
	"03": { 
		"info" : "TECEDU предоставляет широкий спектр консультационных услуг, включая 3D и 360° визуализацию, обучение с использованием дополненной и виртуальной реальностей, разработку и оценку технических компетенций, аутсорсинг обучения, автоматизация процессов обучения, а также разработку учебных материалов.",
		"img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWVRb1YeSx9MxmTiW-plxUCvwS8SwmNLJkJw0x37iv2QKEFvf7",
		"count": "1",
		"gradient": "linear-gradient(135deg, #F0CAA1, #FFD154)"
	}
}




export default class Mycourse extends React.Component {
  
	constructor (props) {
		super(props);
		this.state = {
			index: 0,
			offset: 0, animate: false
		}
	}

	  componentDidMount() {
	    window.addEventListener('scroll', this.parallaxShift);
	  }
	  componentWillUnmount() {
	    window.removeEventListener('scroll', this.parallaxShift);
	  }
	 parallaxShift = () => {
	    this.setState({
	    	offset: window.pageYOffset
	    })
  	 };

	render() {
		return (

				<div className="my_course">
					<label className="my_course_title">Наши <br/><span>курсы</span></label>
					<ScrollTrigger onEnter={()=>this.setState({animate: true})}>
						<div className="course_container">
							{Object.keys(container).map((key, index) => 
								<div style={{background: container[key]["gradient"]}} className={this.state.animate ? "mycourse" : "none"} key={index}>
									<div className="course_row">
										<label>{key}</label>
									</div>
									<p>{container[key]["info"]}</p>
								</div>
							)}
						</div>
					</ScrollTrigger>
				</div>

		)
	}
}