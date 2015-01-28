--- 
layout: post
title: "You Keep Writing That Code. I Do Not Think It Does What You Think It Does."
canonical: "http://timschreiber.com/2013/10/14/you-keep-writing-that-code-i-do-not-think-it-does-what-you-think-it-does"
author: "Tim"
comments: true
description: "Dear unknown previous programmer, Good for you that you used a StringBuilder. Bad for you that you completely missed the point of using a StringBuilder. Worse for you that you're concatenating SQL like this. StringBuilder NDCRecord = new StringBuilder(&quot;Insert into [NDCData] (NDCNumber, NDCDrugName, NDCStrength, NDCFormCode, NDCDEAClass, NDCMeasure, NDCTherapeuticCode, NDCPreviousNDC, NDCGenericCode, NDCGenericName, NDCMDDBTransactionCode, NDCMDDBItemStatusFlag) &quot; + &quot; values ( &quot;      + &quot;'&quot; + lsNDC_Num + &quot;' , &quot;      + &quot;'&quot; + lsNDC_Drug_Name + &quot;', &quot;..."
tags:
- code
- c-sharp
- sql
- work
---

Dear unknown previous programmer,

Good for you that you used a StringBuilder. Bad for you that you completely missed the point of using a StringBuilder. Worse for you that you're concatenating SQL like this.

    StringBuilder NDCRecord = new StringBuilder("Insert into [NDCData] (NDCNumber, NDCDrugName, NDCStrength, NDCFormCode, NDCDEAClass, NDCMeasure, NDCTherapeuticCode, NDCPreviousNDC, NDCGenericCode, NDCGenericName, NDCMDDBTransactionCode, NDCMDDBItemStatusFlag) " +
        " values ( " 
        + "'" + lsNDC_Num + "' , " 
        + "'" + lsNDC_Drug_Name + "', "
        + "'" + lsNDC_Strength + "', " 
        + "'" + lsNDC_FormCode + "', " 
        + "'" + lsNDC_DEAClass + "', "
        + "'" + lsNDC_Measure + "', "
        + "'" + lsNDC_Therapeutic_Code + "', "
        + "'" + lsNDC_Previous_NDC + "', " 
        + "'" + lsNDC_Generic_Code + "', " 
        + "'" + lsNDC_Generic_Name + "', "
        + "'" + lsNDC_MDDB_Transaction_Code + "', " 
        + "'" + lsNDC_MDDB_Item_Status_Flag +"' )" );
