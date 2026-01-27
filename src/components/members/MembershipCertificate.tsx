import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed, for now standard fonts
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/Roboto-Regular.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    borderParams: {
        border: '4pt solid #334155', // Slate-700
        padding: 20,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    churchName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase',
        color: '#1e293b'
    },
    title: {
        fontSize: 32,
        fontWeight: 'heavy', // Not standard in PDF, use standard weights
        marginBottom: 20,
        marginTop: 20,
        color: '#0f172a',
        fontFamily: 'Helvetica-Bold',
        textDecoration: 'none',
        letterSpacing: 2
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 40,
        fontStyle: 'italic'
    },
    body: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 1.6,
        paddingHorizontal: 40
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0f172a',
        marginVertical: 10,
        fontFamily: 'Helvetica-Bold',
        textDecoration: 'underline'
    },
    documentId: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 30
    },
    date: {
        fontSize: 12,
        marginTop: 20,
        color: '#475569'
    },
    signatureSection: {
        marginTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        width: 200,
        marginTop: 40,
        paddingTop: 5,
        textAlign: 'center',
        fontSize: 12,
        color: '#334155'
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 10
    }
});

interface MembershipCertificateProps {
    memberName: string;
    documentId?: string;
    churchName?: string;
    joinDate?: Date;
    pastorName?: string;
}

export const MembershipCertificate = ({ memberName, documentId, churchName = "Iglesia Local", joinDate = new Date(), pastorName = "Pastor Principal" }: MembershipCertificateProps) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.borderParams}>

                <View style={{ alignItems: 'center' }}>
                    {/* Logic for logo if available, placeholder for now */}
                    <Text style={styles.churchName}>{churchName}</Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>CERTIFICADO DE MEMBRESÍA</Text>
                    <Text style={styles.subtitle}>"Así que ya no sois extranjeros ni advenedizos, sino conciudadanos de los santos, y miembros de la familia de Dios." - Efesios 2:19</Text>
                </View>

                <View style={styles.body}>
                    <Text>Por la presente certificamos que</Text>
                    <Text style={styles.name}>{memberName}</Text>
                    {documentId && <Text style={styles.documentId}>Documento: {documentId}</Text>}
                    <Text>Ha sido recibido(a) oficialmente como miembro activo y en plena comunión.</Text>
                    <Text style={styles.date}>Dado el día {joinDate.toLocaleDateString()}</Text>
                </View>

                <View style={styles.signatureSection}>
                    <View>
                        <Text style={styles.signatureLine}>{pastorName}</Text>
                        <Text style={{ textAlign: 'center', fontSize: 10, color: '#64748b' }}>Pastor Principal</Text>
                    </View>
                    {/* Optional Second Signature */}
                    {/* <View>
                  <Text style={styles.signatureLine}>Secretario</Text>
              </View> */}
                </View>
            </View>
        </Page>
    </Document>
);
