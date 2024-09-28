import {useEffect, useState, useRef} from 'react'
import {StyleSheet, Animated, View, TouchableOpacity, Dimensions,BackHandler} from 'react-native'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import {Colors} from '../constants/Colors'

const {width, height} = Dimensions.get('window');

const ActionButton = ({options=[]}) => {

    const [toggle, setToggle] = useState(false);
   

    const animatedValues = {
        animation: useRef(new Animated.Value(0)).current
    };

    const {animation} = animatedValues;

    useEffect(() => {
        handleAnimated();
    }, [toggle]);

    const handleAnimated = () => {
        Animated.spring(animation, {
            toValue: toggle ? 1 : 0,
            friction: toggle ? 4 : 8,
            useNativeDriver: false
        }).start();
    };

    const animatedExpand = {
        transform: [
            {
                scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 4.5]
                })
            }
        ]
    };

    const animatedClose = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '135deg']
                })
            }
        ]
    };


    useEffect(() => {
        const backAction = () => {
            if (toggle) {
                setToggle(false); // Close the toggle
                return true; // Prevent default back behavior
            }
            return false; // Allow default back behavior
        };
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
        return () => backHandler.remove(); // Clean up the event listener
    }, [toggle]);

    return (
        <View style={styles.container}>
            {/* Conditionally render the backdrop when the toggle is true */}
            {toggle && <TouchableOpacity 
                style={styles.backdrop} 
                onPress={() => setToggle(false)} 
                activeOpacity={1}
            />}
            
            <TouchableOpacity
                onPress={() => setToggle(!toggle)}
                style={[styles.itemContainer, {zIndex: 30, backgroundColor:  '#0070FF'}]}>
                <Animated.View style={animatedClose}>
                    <Material name={'plus'} color={'#fff'} size={28} />
                </Animated.View>
            </TouchableOpacity>

            {
                options.map(x =>
                    <Animated.View
                        key={x.id}
                        style={[
                            styles.itemContainer,
                            {
                                backgroundColor: toggle ? 'rgba(0,0,0, 0.1)' : '#0070FF',
                                transform: [
                                    {
                                        translateX: animation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, x.translation === 'left' ? -100 : x.translation === 'middle' ? -70 : x.translation=='middle-top'?-55: 0]
                                        })
                                    },
                                    {
                                        translateY: animation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, x.translation === 'top' ? -100 : x.translation === 'middle-top' ? -90 :x.translation === 'middle' ? -70 :0]
                                        })
                                    }
                                ]
                            }
                        ]}
                    >
                        <TouchableOpacity style={styles.itemButton} onPress={x.action}>
                            <Material name={x.icon} color={'#fff'} size={20} />
                        </TouchableOpacity>
                    </Animated.View>
                )
            }

            <Animated.View style={[styles.itemContainer, {zIndex: 0, backgroundColor: '#0070FF'}, animatedExpand]} />
        </View>
    );
}

export default ActionButton;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
       
    
    },
    itemContainer: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        right: 25,
        borderRadius: 100,
        zIndex: 20
    },
    itemButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent backdrop
        zIndex: 10, // above the rest of the content
    },
});
