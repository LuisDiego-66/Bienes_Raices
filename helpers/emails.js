import nodemailer from 'nodemailer'

const emailRegistro = async (datos)=>{             //funcion asincrona porq se enviara el email y puede tardar un rato
    //integracion copiada de la pagina mailtrap
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    //console.log(datos)
    const { email,nombre,token} = datos

    //Enviar el Email
    await transport.sendMail({
        
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu Cuenta en BienesRaices.com',
        text: 'Confirma tu Cuenta en BienesRaices.com',
        html:  `
            <p> Hola ${nombre} confirma tu cuenta en bienesraices.com </p>

            <p> Tu cuenta ya está lista , solo debes confirmarla en el siguiente enlace: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}"> Confirmar Cuenta </a> </p>

            <p> Si no creaste esta cuenta, puedes ignorar el enlace </p>
        `   
    })
}

const emailOlvidePassword = async (datos)=>{       
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    const { email,nombre,token} = datos

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu Password en BienesRaices.com',
        text: 'Reestablece tu Password en BienesRaices.com',
        html:  `
            <p> Hola ${nombre}, Haz solicitado Reestablecer tu Password en bienesraices.com </p>

            <p> Sigue el siguiente Enlace para generar un Password nuevo: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}"> Reestablecer Password </a> </p>

            <p> Si tu no solicitaste el cambio de password , puedes ignorar el enlace </p>
        `   
    })
}

export{
    emailRegistro,
    emailOlvidePassword
}