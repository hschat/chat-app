let React = require('react-native');
let {StyleSheet, Dimensions, Platform} = React;

const colors = {
    primaryColor: 'rgb(216, 0, 48)',
    primaryColorDark: 'rgb(183, 18, 52)',
    secondaryColorLight: 'rgb(110, 118, 124)',
    secondaryColor: 'rgb(75, 86, 94)',
    secondaryColorDark: 'rgb(68, 74, 78)',
    accent1Color: 'rgb(215, 216, 216)',
    accent2Color: 'rgb(234, 235, 235)',
    accent3Color: 'rgb(255, 255, 255)'
};

module.exports.colors = colors;

module.exports = StyleSheet.create({
    backgroundImage: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'cover'
    },
    middle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 0,
    },
    redButton: {
        backgroundColor: colors.primaryColor,
        marginTop: 5,
        marginBottom: 5,
    },
    redButtonText: {
        color: colors.accent3Color,
    },
    backgroundButtonInput: {
        backgroundColor: 'rgba(255,255,255, 0.6)',
        padding: 5,
        marginTop: 5,
        marginBottom: 5,
    },
    transparent: {
        backgroundColor: 'rgba(0,0,0,0)'
    }

})
;