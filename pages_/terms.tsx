import useTranslation from 'next-translate/useTranslation';
import Layout from 'src/components/Layout';
import Card from 'react-bootstrap/Card';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

export default function Terms() {
  const { t } = useTranslation();
  useFirebaseMessage();

  return (
    <Layout>
      <Card className="cauda_card cauda_about mt-1 mb-4 mx-auto">
        <Card.Header className="text-center">
          <h2 className="h4 mb-0">{t('common:terms-conditions')}</h2>
        </Card.Header>
        <Card.Body style={{ fontSize: '80%' }}>
          <p>
            <span>
              <strong>
                Términos y Condiciones y Política de Privacidad de la Aplicación
                “CAUDA”
              </strong>
            </span>
          </p>
          <p>
            Bienvenido al Sitio Web
            <a href="https://cauda.app/">
              <span> https://cauda.app</span>{' '}
            </a>
            (en adelante el “Sitio Web”) y a la aplicación a la que se accede y
            funciona desde el Sitio Web, (en adelante “CAUDA”) de propiedad de
            AWAM TRADE SRL, con domicilio en legal en J. Salguero 647 9B - CABA
            (en lo sucesivo, el “Propietario”).
          </p>
          <p>
            Estos Términos y Condiciones y la Política de Privacidad (en
            adelante, denominados en conjunto como los “Términos y Condiciones”)
            regulan el acceso y uso de CAUDA por parte de los Usuarios (conforme
            este término se define a continuación) quienes en forma previa al
            uso CAUDA deben leer, entender y aceptar estos Términos y
            Condiciones.
          </p>
          <p>
            <strong>
              CUALQUIER PERSONA QUE DESEE ACCEDER Y UTILIZAR LA APLICACIÓN,
              DEBERÁ ACEPTAR ESTOS TÉRMINOS Y CONDICIONES, LOS CUALES TIENEN UN
              CARÁCTER OBLIGATORIO Y VINCULANTE. CUALQUIER PERSONA QUE NO ACEPTE
              ESTOS TÉRMINOS Y CONDICIONES DEBERÁ ABSTENERSE DE UTILIZAR LA
            </strong>
            <strong> </strong>
            <strong>APLICACIÓN.</strong>
          </p>
          <p>
            <span>
              <strong>
                <i>SERVICIOS. </i>
              </strong>
            </span>
            CAUDA es una aplicación web que funciona como una plataforma para la
            gestión y solicitud de turnos en forma virtual accesible a través
            del Sitio Web. CAUDA facilita la intermediación conectando a los
            establecimientos que se registren debidamente en CAUDA para gestionar el
            sistema de turnos de atención (en adelante, los “
            <strong>Establecimientos Adheridos</strong>”) con aquellos usuarios que se
            registren en CAUDA para encontrar y solicitar un turno para ser
            atendido en el Establecimiento Adherido que éste elija (en adelante, el “
            <strong>Cliente</strong>”), sujeto a la disponibilidad de los días y
            horarios de cada establecimiento (en adelante los “
            <strong>Servicios</strong>”). Se entiende como{' '}
            <strong>Usuario </strong>a todo aquel que esté registrado en la
            Aplicación, incluyendo al Cliente y al Establecimiento Adherido.
          </p>
          <p>
            <span>
              <strong>
                <i>REQUISITOS OPERATIVOS. </i>
              </strong>
            </span>
            Para utilizar CAUDA, el Usuario debe acceder al Sitio Web desde un
            dispositivo con sistema operativo compatible que cuente con acceso a
            Internet. No es necesario descargar y/o instalar CAUDA. El Usuario
            acepta que, en caso de no contar con el dispositivo y/o la conexión
            adecuada, no podrá utilizar CAUDA toda vez que la misma se presta
            únicamente a través del Sitio Web. El Cliente también podrá acceder
            y usar CAUDA mediante el escaneo del código QR exhibido en el
            Establecimiento Adherido desde su dispositivo móvil con acceso a Internet.
          </p>
          <p>
            <span>
              <strong>
                <i>CAPACIDAD</i>
              </strong>
            </span>
            <strong>. </strong>Los Servicios sólo están disponibles para
            personas que tengan capacidad legal para contratar dentro del
            territorio nacional argentino. No podrán utilizar los Servicios las
            personas que no tengan esa capacidad, los menores de edad o Usuario
            del Sitio Web que hayan sido suspendidos temporalmente o inhabilitados
            definitivamente. Si estás registrando un Usuario como Establecimiento
            Adherido, debes tener capacidad para contratar a nombre de tal
            entidad y de obligar a la misma.
          </p>
          <p>
            <span>
              <strong>
                <i>REGISTRACIÓN. </i>
              </strong>
            </span>
            En forma previa a la utilización de CAUDA y los Servicios, los
            Usuarios deberán registrarse en el Sitio Web, completando todos los
            campos requeridos con los datos personales (en adelante los “Datos
            Personales”), los cuales deberán ser exactos, precisos y verdaderos,
            debiendo ser actualizados cuando corresponda.
          </p>
          <p>
            El Establecimiento Adherido deberá seleccionar la opción “MI COMERCIO” y
            luego deberá completar los campos requeridos con el nombre, número
            telefónico del establecimiento, dirección, días y horarios de atención al
            público. Estos datos son importantes para que los Clientes puedan
            gestionar los turnos con el Establecimiento Adherido.
          </p>
          <p>
            Los Clientes deberán elegir la opción “BUSCAR COMERCIOS”. A
            continuación, se le requerirá en la pantalla principal que habiliten
            el acceso a la ubicación del dispositivo mediante la función de
            geolocalización para poder encontrar los Establecimientos Adheridos. En
            caso de que el Usuario desee escanear el código QR del Establecimiento
            Adherido, se requerirá acceso a la cámara del dispositivo.
          </p>
          <p>
            Todos los Usuarios deberán verificar un número telefónico móvil para
            poder registrarse, para ello CAUDA le enviará automáticamente un
            código vía “SMS” (mensaje de texto), el cual deberá ser ingresado en
            el campo correspondiente del formulario en el Sitio Web para validar
            y finalizar exitosamente el proceso de registro.
          </p>
          <p>
            <span>
              <strong>
                <i>MODOS DE USO. </i>
              </strong>
            </span>
            Luego de la registración y aceptación de estos Términos y
            Condiciones y Política de Privacidad, el Establecimiento Adherido se
            exhibirá para todos aquellos Clientes que se encuentren dentro del
            radio de cercanía (en adelante, el “Alcance de los Servicios”). De
            este modo, los Clientes que se hubiesen registrado y aceptado los
            Términos y Condiciones y la Política de Privacidad podrán encontrar
            y visualizar los Establecimiento Adheridos que se encuentren cercanos a su
            ubicación dentro del Alcance de los Servicios.
          </p>
          <p>
            El Establecimiento Adherido tendrá habilitada la fila virtual donde podrá
            visualizar los turnos gestionados por los Clientes, los cuales
            estarán identificados con un código alfanumérico, pudiendo el
            Establecimiento Adherido seleccionar las opciones de “ATENDER” o “SALTEAR”
            los turnos, según corresponda.
          </p>
          <p>
            El Cliente podrá encontrar y visualizar en un mapa los Establecimiento
            Adheridos ordenados por cercanía dentro del Alcance de los
            Servicios, y según éstos se encuentren abiertos, pudiendo
            seleccionar el establecimiento que desee seleccionando a continuación
            “CONFIRMAR TURNO”.
          </p>
          <p>
            Además, el Cliente podrá sacar turno en los Establecimientos Adheridos
            escaneando con su dispositivo el código QR que corresponda a cada
            Establecimiento Adherido y clickear el botón en “CONFIRMAR TURNO”. También
            será posible cancelar el turno al clickear el botón "CANCELAR
            TURNO".
          </p>
          <p>
            Oportunamente, se le enviará al Cliente una notificación (SMS o
            notificación Push) donde se le recordará que ya está próximo a ser
            atendido y que debe dirigirse al establecimiento. El Cliente podrá
            ver los turnos activos en la pantalla principal de CAUDA.
          </p>
          <p>
            <span>
              <strong>
                <i>DATOS PERSONALES. </i>
              </strong>
            </span>
            El Propietario informa a los Usuarios que la recolección y tratamiento
            de sus Datos Personales se realiza de conformidad con la Ley de
            Protección de Datos Personales Nº 25.326, su Decreto Reglamentario
            1558/2001 y demás normas complementarias (“Normativa de Protección
            de Datos Personales”). El Usuario presta su consentimiento expreso
            para que el CAUDA recolecte, almacene, procese, revele, divulgue,
            publique y utilice sus Datos Personales en base a estos Términos y
            Condiciones.
          </p>
          <p>
            El Usuario garantiza y responde, en cualquier caso, por la
            veracidad, exactitud, vigencia y autenticidad de los Datos
            Personales facilitados y se compromete a mantenerlos debidamente
            actualizados. Para hacer cualquier modificación en los Datos
            Personales suministrados mediante CAUDA, se debe ingresar en la
            sección de edición del comercio.
          </p>
          <p>
            <span>
              <strong>
                <i>Finalidades de Tratamiento</i>
              </strong>
            </span>
          </p>
          <p>
            Sus Datos Personales podrán ser utilizados para los siguientes
            propósitos:
          </p>

          <ul>
            <li>
              A fin de que el Usuario pueda registrarse en CAUDA y sea posible
              ubicar a los Usuarios para que el Usuario pueda usar CAUDA de un
              modo eficiente.
            </li>
          </ul>
          <ul>
            <li>
              A fin de mejorar nuestros Servicios y las funcionalidades de
              CAUDA.
            </li>
          </ul>
          <ul>
            <li>
              Desarrollar estudios sobre intereses, comportamientos y demografía
              de los Usuarios para comprender mejore sus necesidades, ofrecer
              mejores servicios o proveer información relacionada.
            </li>
          </ul>
          <ul>
            <li>
              Enviar información sobre publicidad, promociones, noticias e
              información sobre los servicios de interés de los Usuarios. Si el
              Usuario lo prefiere, puede solicitar que lo excluyan de la lista
              para envío de información promocional o publicitaria enviando un
              correo electrónico a
              <a href="mailto:somos@cauda.app"> somos@cauda.app.</a>
            </li>
          </ul>
          <ul>
            <li>
              Compartir los Datos Personales con los proveedores de servicios,
              empresas de outsourcing o con empresas con las que CAUDA tenga una
              relación de colaboración que contribuyan a mejorar o facilitar las
              operaciones a través de CAUDA.
            </li>
          </ul>
          <p>
            El Usuario entiende, acepta y consiente expresamente que CAUDA
            podría ceder o transferir –<i>ya sea total o parcialmente</i>– los
            Datos Personales a terceros, a nivel nacional o internacional,
            incluso a países que no tengan el mismo nivel de protección que la
            República Argentina, para el cumplimiento de las finalidades
            establecidas en estos Términos y Condiciones.
          </p>
          <p>
            En tal sentido, CAUDA informa a los Usuarios que toda actividad de
            tratamiento los Datos Personales se llevará a cabo sin exceder las
            finalidades estipuladas en los presentes Términos y Condiciones.
          </p>
          <p>
            Sus Datos Personales se procesan y almacenan en servidores que
            respetan altos estándares de seguridad y protección tanto física
            como tecnológica.
          </p>
          <p>
            El Usuario entiende que los Datos Personales que debe proveer a
            través del Sitio Web para registrarse y utilizar CAUDA son
            necesarios para poder acceder a los Servicios y, en consecuencia,
            reconoce y acepta que si no proporciona los Datos Personales o si
            proporciona datos falsos o inexactos o incompletos el acceso y/o uso
            de CAUDA podría verse restringido, limitado o bloqueado.
          </p>
          <p>
            <span>
              <strong>
                <i>SUS DERECHOS. </i>
              </strong>
            </span>
            Los Usuarios tienen el derecho a solicitar y obtener información
            sobre sus Datos Personales, así como solicitar la rectificación,
            actualización y, de corresponder, supresión de sus Datos Personales.
          </p>
          <p>
            <span>
              El Propietario le informa a los Usuarios que de acuerdo con lo
              establecido en el Artículo 14, inciso 3 de la LPDP, e
            </span>
            l titular de los datos personales tiene la facultad de ejercer el
            derecho de acceso a los mismos en forma gratuita a intervalos no
            inferiores a seis meses, salvo que se acredite un interés legítimo.
          </p>
          <p>
            Los Usuarios podrán ponerse en contacto con CAUDA en todo momento
            para acceder, rectificar, actualizar o, de corresponder, solicitar
            la supresión de sus Datos Personales y/o ejercer los derechos que le
            correspondan enviando un correo electrónico a{' '}
            <a href="mailto:somos@cauda.app">somos@cauda.app.</a>
          </p>
          <p>
            De acuerdo con la Resolución N º 14/2018 de la Agencia de Acceso a
            la Información Pública, se informa a los Usuarios que “LA AGENCIA DE
            ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control
            de la Ley N°25.326, tiene la atribución de atender las denuncias y
            reclamos que interpongan quienes resulten afectados en sus derechos
            por incumplimiento de las normas vigentes en materia de protección
            de datos personales”.
          </p>
          <p>
            <span>
              <strong>
                <i>USO DE COOKIES. </i>
              </strong>
            </span>
            Además de los Datos Personales, existe información que puede
            obtenerse en forma automática, como por ejemplo el tipo de navegador
            que usa, el sistema operativo o el nombre de dominio del sitio de la
            red desde el cual se vinculó con nosotros. A fin de mejorar la
            funcionalidad de nuestro Sitio Web y de CAUDA, utilizamos cookies.
            Las cookies son pequeños ficheros de datos que el Sitio Web le
            proporciona a su navegador cuando usted visita nuestro Sitio Web.
            Estos datos se almacenan en su navegador. Cada vez que usted visita
            nuestro Sitio Web, la cookie es devuelta a nuestro servidor de la
            web. Las “cookies” no son programas de computación y no se ejecutan
            en una computadora como en el caso de los programas. Las utilizamos
            para guardar la información de su sesión y recopilar información
            acerca de su actividad en nuestro sitio. Las cookies nos habilitan
            para proporcionarle una experiencia en línea más valiosa. Usted
            puede configurar su explorador de Internet para rechazar o bloquear
            las cookies, aunque le advertimos que ello podría significar que
            algunas partes de nuestro Sitio Web y nuestros servicios en línea
            podrían no funcionar correctamente, o no funcionar en absoluto.
          </p>
          <p>
            <span>
              <strong>
                <i>GRATUIDAD DE LA APLICACIÓN</i>
              </strong>
            </span>
            <strong>. </strong>El acceso y uso a CAUDA no tiene costo alguno
            para los Usuarios, salvo en lo relativo al costo de conexión a
            través de la red de telecomunicaciones suministrada por un proveedor
            de acceso que estará a exclusivo cargo del Usuario. Sin perjuicio de 
            ello, CAUDA se reserva el derecho de fijar una tarifa de servicio para 
            los Establecimientos Adheridos que tengan un cierto volumen de demanda – 
            el cual será definido a exclusivo criterio de CAUDA - con el fin de 
            mantener la calidad y gratuidad del servicio para los restantes Usuarios. 
            En caso de que el Propietario decida aplicar una tarifa por el uso de CAUDA,
            ello será comunicado a los Usuarios con una antelación razonable a través 
            del Sitio Web.
          </p>
          <p>
            <span>
              <strong>
                <i>USO DE CAUDA POR LOS USUARIOS. </i>
              </strong>
            </span>
            El Usuario se compromete a hacer uso de CAUDA en forma adecuada y
            lícita de conformidad con la legislación aplicable y los presentes
            Términos y Condiciones. El Cliente acuerda que solo utilizará CAUDA
            para su uso personal y el Establecimiento adherido solo para la gestión
            virtual de turnos del establecimiento registrado en CAUDA. El Usuario
            manifiesta y garantiza que no solicitará los Servicios o utilizará
            CAUDA con fines ilícitos, ilegales, contrarios a lo establecido en
            los presentes Términos y Condiciones, a la buena fe y al orden
            público.
          </p>
          <p>
            En consecuencia, el Usuario se obliga a mantener indemne e
            indemnizar al Propietario por cualquier reclamo judicial o
            extrajudicial encausado, iniciado o dirigido contra El Propietario por
          </p>
          <p>
            cualquier persona humana o jurídica de cualquier naturaleza que se
            derivare de cualquier actividad ilícita, contraria o incompatible
            con los presentes Términos y Condiciones que el Usuario hubiese
            realizado por el Usuario mediante el uso de CAUDA.
          </p>
          <p>
            El Propietario podrá bloquear, cancelar o limitar el acceso o uso del
            Usuario a CAUDA con motivo del incumplimiento de los Términos y
            Condiciones, a su exclusivo criterio sin necesidad de dar aviso
            previo al Usuario.
          </p>
          <p>
            <span>
              <strong>
                <i>RESPONSABILIDAD. </i>
              </strong>
            </span>
            El Usuario entiende y acepta que CAUDA es una aplicación que se
            limita a poner a disposición de los Usuarios un espacio virtual que
            les permite ponerse en comunicación mediante Internet para gestionar
            turnos virtuales. El Propietario de CAUDA no es el propietario ni tiene relación
            o vinculación de ningún tipo con los Establecimientos Adheridos, no
            interviene en el perfeccionamiento de las operaciones realizadas
            entre los Usuarios ni tiene participación alguna en el sistema de
            gestión de turnos, ni en la posterior relación que tuviese lugar
            entre los Usuarios. El Usuario conoce y acepta que al realizar
            operaciones con otros Usuarios lo hace bajo su propio riesgo.
          </p>
          <p>
            <strong>
              <i>
                INTERRUPCIÓN DEL SERVICIO. FALLAS EN EL SISTEMA WEB Y MENSAJERIA
              </i>
            </strong>
            <span>.</span>
          </p>
          <p>
            El Propietario no garantiza la inexistencia de eventuales dificultades
            técnicas, errores o fallas en la red de telecomunicaciones o en Internet, como así
            tampoco garantiza la disponibilidad, funcionamiento, el acceso y uso
            continuado o ininterrumpido de su Sitio Web, CAUDA o los Servicios.
            CAUDA puede eventualmente no estar disponible por actividades de
            mantenimiento, debido a dificultades técnicas, de la red de telecomunicaciones o fallas de Internet,
            o por cualquier otra circunstancia ajena a CAUDA, que no generará
            responsabilidad alguna por parte del Propietario. En tales casos se
            procurará restablecerlo con la mayor celeridad<span>  </span>
            posible.
          </p>
          <p>
            Asimismo, El Propietario se reserva el derecho de interrumpir,
            suspender, discontinuar o modificar en cualquier momento CAUDA o el
            acceso a los Servicios, ya sea en forma permanente o transitoria,
            lo que será comunicado a los Usuarios con antelación razonable de acuerdo al caso.
          </p>
          <p>
            <span>
              <strong>
                <i>ATAQUES DE TERCEROS</i>
              </strong>
            </span>
            <strong>. </strong>Queda a exclusivo riesgo del Usuario el uso del
            Sitio Web, de CAUDA y de los Servicios. El Propietario así como tampoco
            ninguna persona humana o jurídica vinculada a la creación,
            producción, desarrollo o utilización del Sitio Web, del Servicio o
            de CAUDA serán responsables por daños de especie alguna que puedan
            resultar de ese uso, así como tampoco serán responsables de
            cualquier daño a su equipo de computación o dispositivos por
            cualquier virus que pueda infectarlo como consecuencia del uso y
            acceso al Sitio Web, los Servicios o CAUDA.
          </p>
          <p>
            <span>
              <strong>
                <i>PROPIEDAD INTELECTUAL. </i>
              </strong>
            </span>
            Todos los derechos sobre el Sitio Web y CAUDA y sobre cualquier
            contenido de los mismos están reservados y corresponden al Propietario 
            o a terceros de los cuales el Propietario obtuvo las correspondientes 
            autorizaciones o licencias de uso. 
            El Sitio Web y la Aplicación son obras compuestas por
            elementos integrados e inseparables (incluyendo, aunque no limitado
            a los contenidos de las pantallas como así también los programas,
            bases de datos, redes, archivos, logos, gráficos, ilustraciones,
            fotografías, marcas, diseños, música, videos, texto, código HTML
            como asimismo todo el diseño en general) cuya propiedad pertenece al
            Propietario o a terceros de los cuales El Propietario recibió las
            correspondientes licencias o autorizaciones. Todo ello se encuentra
            protegido por la legislación nacional e internacional en materia de
            propiedad intelectual e industrial, derecho de autor, marcas,
            patentes, modelos y diseños industriales, entre otros.
          </p>
          <p>
            El uso indebido y la reproducción total o parcial de dichos
            contenidos quedan prohibidos, salvo autorización expresa y por
            escrito de CAUDA.
          </p>
          <p>
            Todas las marcas y logotipos mostrados en el Sitio Web y en CAUDA
            son propiedad del Propietario. Se prohíbe usarlos, bajarlos o
            descargarlos permanentemente, copiarlos o distribuirlos por
            cualquier medio sin el permiso escrito del Propietario. El acceso y
            uso del Sitio Web y CAUDA no podrá interpretarse como el
            otorgamiento de una licencia de uso, expresa o tácita, de dichas
            marcas ni de ningún otro derecho sobre las mismas.
          </p>
          <p>
            <span>
              <strong>
                <i>MODIFICACIONES</i>
              </strong>
            </span>
            <strong>. </strong>CAUDA se reserva la facultad de modificar,
            revisar, actualizar o cambiar estos Términos y Condiciones, ya sea
            total o parcialmente, en forma periódica. Dichas modificaciones
            serán publicadas con una antelación razonable - a exclusivo criterio
            del Propietario - en el Sitio Web y entrarán en vigor dentro de los
            tres (3) días corridos desde su publicación. el Sitio Web y el uso
            de la Aplicación con posterioridad a la modificación implicará la
            aceptación de los Términos y Condiciones vigentes. Se recomienda a
            los Usuarios revisar periódicamente los Términos y Condiciones del
            Sitio Web y de CAUDA, el uso y acceso del Sitio Web y de CAUDA con
            posterioridad a la entrada en vigor de las modificaciones y
            actualizaciones de los presentes Términos y Condiciones implicará la
            aceptación de los Términos y Condiciones vigentes.
          </p>
          <p>
            <span>
              <strong>
                <i>DERECHO APLICABLE. </i>
              </strong>
            </span>
            En caso de conflicto serán de aplicación las leyes de la República
            Argentina.
          </p>
          <p>
            <strong>
              Para comunicarse con El Propietario y ante cualquier duda o consulta,
              podrá dirigirse a la casilla de correo{' '}
            </strong>
            <a href="mailto:somos@cauda.app">
              <strong>somos@cauda.app.</strong>
            </a>
          </p>
        </Card.Body>
      </Card>
    </Layout>
  );
}
